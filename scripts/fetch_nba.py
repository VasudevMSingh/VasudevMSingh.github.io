import os
import json
import requests
from datetime import datetime, timezone, timedelta
from news_config import NBA_API_URL, NBA_CACHE_FILE, NBA_CACHE_HOURS


def load_nba_cache():
    """Load cached NBA data if it exists"""
    try:
        if os.path.exists(NBA_CACHE_FILE):
            with open(NBA_CACHE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
    except Exception as e:
        print(f"Error loading NBA cache: {e}")
    return {"lastUpdated": None, "games": []}


def save_nba_cache(cache_data):
    """Save NBA data to cache"""
    try:
        os.makedirs(os.path.dirname(NBA_CACHE_FILE), exist_ok=True)
        with open(NBA_CACHE_FILE, "w", encoding="utf-8") as f:
            json.dump(cache_data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Error saving NBA cache: {e}")


def format_game_data(game):
    """Format game data for display"""
    return {
        "id": game["id"],
        "status": game["status"],
        "period": game["period"],
        "home_team": {
            "name": game["home_team"]["full_name"],
            "score": game["home_team_score"],
            "abbreviation": game["home_team"]["abbreviation"],
        },
        "visitor_team": {
            "name": game["visitor_team"]["full_name"],
            "score": game["visitor_team_score"],
            "abbreviation": game["visitor_team"]["abbreviation"],
        },
        "time": game["time"],
        "date": game["date"],
    }


def fetch_recent_games():
    """Fetch recent NBA games"""
    # Get yesterday's date in YYYY-MM-DD format
    yesterday = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")

    try:
        # Fetch games from yesterday
        response = requests.get(
            f"{NBA_API_URL}/games", params={"dates[]": yesterday, "per_page": 100}
        )
        response.raise_for_status()
        games_data = response.json()

        # Format each game
        formatted_games = [format_game_data(game) for game in games_data["data"]]

        return {
            "lastUpdated": datetime.now(timezone.utc).isoformat(),
            "games": formatted_games,
        }
    except Exception as e:
        print(f"Error fetching NBA games: {e}")
        return None


def should_update_cache(cache_data):
    """Check if cache needs updating"""
    if not cache_data["lastUpdated"]:
        return True

    last_updated = datetime.fromisoformat(
        cache_data["lastUpdated"].replace("Z", "+00:00")
    )
    age = datetime.now(timezone.utc) - last_updated
    return age > timedelta(hours=NBA_CACHE_HOURS)


def save_nba_scores():
    """Main function to fetch and save NBA scores"""
    # Load cache
    cache_data = load_nba_cache()

    # Check if we need to update
    if should_update_cache(cache_data):
        new_data = fetch_recent_games()
        if new_data and new_data["games"]:
            cache_data = new_data
            save_nba_cache(cache_data)

    return cache_data


if __name__ == "__main__":
    # Create data directory if it doesn't exist
    os.makedirs("data", exist_ok=True)
    save_nba_scores()
