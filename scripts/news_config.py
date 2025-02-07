"""
Configuration file for news fetching keywords and settings.
Each category has its own set of keywords/phrases to filter news articles.
"""

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
            "NFL",
            "MLB",
            "NHL",
            "Premier League",
            "Champions League",
            "Formula 1",
            "tennis",
            "golf",
            "Olympics",
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
            "ERCOT",
            "CAISO",
            "ENGIE",
            "Vistra",
            "Energy Storage",
            "Battery Storage",
            "Tolling Agreement",
            "power market",
            "electricity prices",
            "grid reliability",
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
