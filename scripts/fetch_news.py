import os
import json
import time
import requests
from datetime import datetime, timezone, timedelta
from news_config import (
    NEWS_FILTERS,
    CACHE_FILE,
    CACHE_EXPIRY_DAYS,
    NEWS_SOURCES,
    NEWSAPI_URL,
    GNEWS_API_URL,
)


def load_cache():
    """Load the cached news data if it exists"""
    try:
        if os.path.exists(CACHE_FILE):
            with open(CACHE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
    except Exception as e:
        print(f"Error loading cache: {e}")
    return {"sections": {}}


def save_cache(cache_data):
    """Save the current news data to cache"""
    try:
        os.makedirs(os.path.dirname(CACHE_FILE), exist_ok=True)
        with open(CACHE_FILE, "w", encoding="utf-8") as f:
            json.dump(cache_data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Error saving cache: {e}")


def is_article_relevant(article, keywords):
    """Check if article matches any keywords"""
    text = (article.get("title", "") + " " + article.get("description", "")).lower()
    return any(keyword.lower() in text for keyword in keywords)


def filter_and_deduplicate(articles, keywords, max_articles):
    """Filter articles by keywords and remove duplicates"""
    seen_titles = set()
    filtered_articles = []

    for article in articles:
        title = article.get("title", "").lower()
        if title not in seen_titles and is_article_relevant(article, keywords):
            seen_titles.add(title)
            filtered_articles.append(
                {
                    "title": article["title"],
                    "url": article["url"],
                    "source": article["source"]["name"],
                    "publishedAt": article["publishedAt"],
                }
            )
            if len(filtered_articles) >= max_articles:
                break

    return filtered_articles


def fetch_from_newsapi(category, keywords):
    api_key = os.getenv("NEWSAPI_KEY")
    if not api_key:
        print(f"NewsAPI key not found for {category}")
        return []

    articles = []
    query = " OR ".join(f'"{kw}"' for kw in keywords)
    source_config = NEWS_SOURCES.get(category, NEWS_SOURCES["default"])

    params = {
        "q": query,
        "apiKey": api_key,
        "language": "en",
        "sortBy": "publishedAt",
        "pageSize": NEWS_FILTERS[category]["max_articles"],
    }

    if "domains" in source_config:
        params["domains"] = source_config["domains"]

    try:
        response = requests.get(NEWSAPI_URL, params=params)
        if response.status_code == 200:
            data = response.json()
            articles = data.get("articles", [])
            # Transform to match our format
            articles = [
                {
                    "title": article["title"],
                    "description": article["description"],
                    "url": article["url"],
                    "image": article.get("urlToImage", ""),
                    "publishedAt": article["publishedAt"],
                    "source": article["source"]["name"],
                }
                for article in articles
                if article["title"] and article["description"]
            ]
    except Exception as e:
        print(f"Error fetching from NewsAPI for {category}: {str(e)}")

    return articles[: NEWS_FILTERS[category]["max_articles"]]


def fetch_from_gnews(category, keywords):
    api_key = os.getenv("GNEWS_API_KEY")
    if not api_key:
        print(f"GNews API key not found for {category}")
        return []

    articles = []
    query = " OR ".join(f'"{kw}"' for kw in keywords)

    params = {
        "q": query,
        "token": api_key,
        "lang": "en",
        "country": "us",
        "max": NEWS_FILTERS[category]["max_articles"],
    }

    try:
        response = requests.get(GNEWS_API_URL, params=params)
        if response.status_code == 200:
            data = response.json()
            articles = data.get("articles", [])
    except Exception as e:
        print(f"Error fetching from GNews for {category}: {str(e)}")

    return articles[: NEWS_FILTERS[category]["max_articles"]]


def fetch_news():
    # Load existing cache if it exists
    cache = {}
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, "r") as f:
            cache = json.load(f)

    # Current time for cache validation
    current_time = datetime.now()

    # Process each news category
    for category, config in NEWS_FILTERS.items():
        print(f"Fetching {category}...")

        # Check if we need to update this category
        category_cache = cache.get(category, {})
        last_updated = datetime.fromisoformat(
            category_cache.get("last_updated", "2000-01-01T00:00:00")
        )
        cache_age = current_time - last_updated

        if (
            cache_age.days < CACHE_EXPIRY_DAYS
            and len(category_cache.get("articles", [])) >= config["min_articles"]
        ):
            print(f"Using cached data for {category}")
            continue

        # Determine which API to use
        source_config = NEWS_SOURCES.get(category, NEWS_SOURCES["default"])
        if source_config["api"] == "newsapi":
            articles = fetch_from_newsapi(category, config["keywords"])
        else:
            articles = fetch_from_gnews(category, config["keywords"])

        # Update cache if we got enough articles
        if len(articles) >= config["min_articles"]:
            cache[category] = {
                "last_updated": current_time.isoformat(),
                "articles": articles,
            }
            print(f"Updated {category} with {len(articles)} articles")
        else:
            print(f"Not enough articles found for {category}")

    # Save updated cache
    with open(CACHE_FILE, "w") as f:
        json.dump(cache, f, indent=2)


if __name__ == "__main__":
    # Create data directory if it doesn't exist
    os.makedirs("data", exist_ok=True)
    fetch_news()
