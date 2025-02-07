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
    "TECH_NEWS": {
        "api": "newsapi",
        "domains": "techcrunch.com,theverge.com,wired.com,arstechnica.com,venturebeat.com,zdnet.com,cnet.com,engadget.com,thenextweb.com,protocol.com,vice.com/en/section/tech",
    },
    "NBA_NEWS": {
        "api": "newsapi",
        "domains": "espn.com,nba.com,basketballnews.com,hoopshype.com,bleacherreport.com,cbssports.com/nba,sports.yahoo.com/nba",
    },
    "default": {
        "api": "gnews",
    },
}

NEWS_FILTERS = {
    "ENERGY_NEWS": {
        "keywords": [
            # Market Operations
            "ERCOT",
            "CAISO",
            "PJM",
            "MISO",
            "SPP",
            "NYISO",
            "ISO-NE",
            "AEMO",
            # Storage and Grid
            "battery storage",
            "energy storage",
            # Market Dynamics
            "electricity prices",
            "capacity market",
            "ancillary services",
            # Renewable Integration
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
    "TECH_NEWS": {
        "keywords": [
            # AI and Machine Learning
            "artificial intelligence breakthrough",
            "AI research",
            "machine learning innovation",
            "GPT-4",
            "AI ethics",
            # Enterprise Tech
            "cloud computing",
            "enterprise software",
            "cybersecurity threat",
            "data privacy",
            # Emerging Tech
            "quantum computing advance",
            "blockchain technology",
            "Web3 development",
            # Industry News
            "tech earnings",
            "startup funding",
            "tech acquisition",
            "tech regulation",
            # Innovation
            "tech innovation",
            "product launch",
            "research breakthrough",
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
}

# Cache settings
CACHE_FILE = "data/news.json"
CACHE_EXPIRY_DAYS = 3  # How long to keep articles before they expire
