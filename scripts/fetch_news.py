import os
import json
import requests
from datetime import datetime, timezone


def fetch_tech_news(api_key):
    """Fetch technology news from Gnews"""
    url = "https://gnews.io/api/v4/search"
    params = {
        "token": api_key,
        "q": "technology",
        "lang": "en",
        "max": 5,  # Limit to 5 articles
        "sortby": "publishedAt",
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        articles = response.json()["articles"]

        # Format articles
        formatted_articles = []
        for article in articles:
            formatted_articles.append(
                {
                    "title": article["title"],
                    "url": article["url"],
                    "source": article["source"]["name"],
                    "publishedAt": article["publishedAt"],
                }
            )

        return formatted_articles
    except Exception as e:
        print(f"Error fetching tech news: {e}")
        return []


def save_news():
    """Main function to fetch and save news"""
    api_key = os.environ.get("GNEWS_API_KEY")
    if not api_key:
        raise ValueError("GNEWS_API_KEY environment variable not set")

    # Create news object
    news_data = {
        "lastUpdated": datetime.now(timezone.utc).isoformat(),
        "sections": {"TECH_NEWS": fetch_tech_news(api_key)},
    }

    # Save to JSON file
    with open("data/news.json", "w", encoding="utf-8") as f:
        json.dump(news_data, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    # Create data directory if it doesn't exist
    os.makedirs("data", exist_ok=True)
    save_news()
