import os
import json
import requests
from datetime import datetime, timezone, timedelta
from news_config import NEWS_FILTERS, CACHE_FILE, CACHE_EXPIRY_DAYS


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


def fetch_news_for_section(section, config, api_key):
    """Fetch news for a specific section using its keywords"""
    url = "https://gnews.io/api/v4/search"

    # Join keywords with OR for the search query
    query = " OR ".join(f'"{keyword}"' for keyword in config["keywords"])

    params = {
        "token": api_key,
        "q": query,
        "lang": "en",
        "max": 10,  # Fetch more than needed for better filtering
        "sortby": "publishedAt",
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        articles = response.json()["articles"]

        # Filter and limit articles
        return filter_and_deduplicate(
            articles, config["keywords"], config["max_articles"]
        )
    except Exception as e:
        print(f"Error fetching {section}: {e}")
        return []


def merge_with_cache(new_articles, cached_articles, min_articles):
    """Merge new articles with cached ones if we don't have enough new articles"""
    if len(new_articles) >= min_articles:
        return new_articles

    # Use cached articles to fill up to min_articles
    needed = min_articles - len(new_articles)
    return new_articles + cached_articles[:needed]


def save_news():
    """Main function to fetch and save news"""
    api_key = os.environ.get("GNEWS_API_KEY")
    if not api_key:
        raise ValueError("GNEWS_API_KEY environment variable not set")

    # Load cached data
    cache_data = load_cache()

    # Prepare new news data
    news_data = {"lastUpdated": datetime.now(timezone.utc).isoformat(), "sections": {}}

    # Process each section
    for section, config in NEWS_FILTERS.items():
        # Fetch new articles
        new_articles = fetch_news_for_section(section, config, api_key)

        # Get cached articles for this section
        cached_articles = cache_data.get("sections", {}).get(section, [])

        # Merge with cache if needed
        final_articles = merge_with_cache(
            new_articles, cached_articles, config["min_articles"]
        )

        news_data["sections"][section] = final_articles

    # Save both to cache and current news file
    save_cache(news_data)

    # Save current news to the main news.json file
    with open("data/news.json", "w", encoding="utf-8") as f:
        json.dump(news_data, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    # Create data directory if it doesn't exist
    os.makedirs("data", exist_ok=True)
    save_news()
