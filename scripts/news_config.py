"""
Configuration file for news fetching keywords and settings.
Each category has its own set of keywords/phrases to filter news articles.
"""

# News API Configuration
NEWSAPI_URL = "https://newsapi.org/v2/everything"
GNEWS_API_URL = "https://gnews.io/api/v4/search"

NEWS_SOURCES = {
    "ENERGY_NEWS": {
        "api": "newsapi",
        "domains": "reuters.com,bloomberg.com,cnbc.com,ft.com,wsj.com",
    },
    "default": {
        "api": "gnews",
    },
}

NEWS_FILTERS = {
    "TECH_NEWS": {
        "keywords": [
            "artificial intelligence",
            "machine learning",
            "quantum computing",
            "blockchain",
            "cybersecurity",
            "programming",
            "software",
            "technology",
            "tech industry",
            "startup",
            "innovation",
        ],
        "max_articles": 5,
        "min_articles": 3,
    },
    "SPORTS_NEWS": {
        "keywords": [
            "NBA",
            "Counter-Strike",
            "Champions League",
            "Formula 1",
            "tennis",
            "golf",
            "CS2",
        ],
        "max_articles": 5,
        "min_articles": 3,
    },
    "NBA_NEWS": {
        "keywords": [
            "NBA trade",
            "NBA draft",
            "NBA free agency",
            "NBA playoffs",
            "NBA finals",
            "NBA all-star",
            "NBA injury",
            "NBA contract",
        ],
        "max_articles": 5,
        "min_articles": 3,
    },
    "ENERGY_NEWS": {
        "keywords": [
            "renewable energy",
            "ERCOT market",
            "CAISO market",
            "battery storage",
            "power prices",
            "electricity market",
            "energy storage",
            "grid reliability",
            "power grid",
            "energy markets",
            "wholesale electricity",
        ],
        "max_articles": 5,
        "min_articles": 2,
    },
}

# Cache settings
CACHE_FILE = "data/news_cache.json"
CACHE_EXPIRY_DAYS = 3  # How long to keep articles before they expire

# NBA API settings
NBA_API_URL = "https://www.balldontlie.io/api/v1"
NBA_CACHE_FILE = "data/nba_cache.json"
NBA_CACHE_HOURS = 12  # How long to keep NBA scores before refreshing
