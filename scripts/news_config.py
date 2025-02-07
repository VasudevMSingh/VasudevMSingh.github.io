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
        "domains": "reuters.com,bloomberg.com,cnbc.com,ft.com,wsj.com,spglobal.com,utilitydive.com,energyintel.com,powermag.com,renewablesnow.com,energy-storage.news,pv-tech.org,rechargenews.com",
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
            # Market Operations
            "ERCOT market",
            "CAISO market",
            "PJM market",
            "MISO market",
            "SPP market",
            "NYISO market",
            "ISO-NE market",
            "AEMO market",
            # Storage and Grid
            "battery storage",
            "energy storage",
            "grid reliability",
            "power grid",
            "grid congestion",
            "transmission constraints",
            # Market Dynamics
            "power prices",
            "electricity prices",
            "energy markets",
            "wholesale electricity",
            "capacity market",
            "ancillary services",
            # Renewable Integration
            "renewable integration",
            "solar plus storage",
            "wind integration",
            "hybrid projects",
            # Companies and Projects
            "Tesla Megapack",
            "Fluence Energy",
            "Energy Vault",
            "Form Energy",
            "ESS Inc",
            # Regulatory and Policy
            "FERC Order",
            "energy policy",
            "IRA energy",
            "clean energy incentives",
        ],
        "max_articles": 8,
        "min_articles": 3,
    },
}

# Cache settings
CACHE_FILE = "data/news_cache.json"
CACHE_EXPIRY_DAYS = 3  # How long to keep articles before they expire

# NBA API settings
NBA_API_URL = "https://www.balldontlie.io/api/v1"
NBA_CACHE_FILE = "data/nba_cache.json"
NBA_CACHE_HOURS = 12  # How long to keep NBA scores before refreshing
