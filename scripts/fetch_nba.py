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


def get_team_stats(game_id):
    """Fetch detailed stats for a game"""
    try:
        response = requests.get(f"{NBA_API_URL}/stats", params={"game_ids[]": game_id})
        response.raise_for_status()
        stats = response.json()["data"]

        # Group stats by team
        team_stats = {}
        for stat in stats:
            team_id = stat["team"]["id"]
            if team_id not in team_stats or stat["pts"] > team_stats[team_id]["pts"]:
                team_stats[team_id] = {
                    "name": stat["player"]["first_name"]
                    + " "
                    + stat["player"]["last_name"],
                    "points": stat["pts"],
                    "rebounds": stat["reb"],
                    "assists": stat["ast"],
                }
        return team_stats
    except Exception as e:
        print(f"Error fetching game stats: {e}")
        return {}


def get_team_record(team_id):
    """Fetch team's current record"""
    try:
        response = requests.get(f"{NBA_API_URL}/teams/{team_id}")
        response.raise_for_status()
        team_data = response.json()
        return f"{team_data['win_count']}-{team_data['loss_count']}"
    except Exception as e:
        print(f"Error fetching team record: {e}")
        return "0-0"


def format_game_data(game):
    """Format game data for display"""
    # Get team records and top scorers
    home_record = get_team_record(game["home_team"]["id"])
    visitor_record = get_team_record(game["visitor_team"]["id"])
    team_stats = get_team_stats(game["id"])

    return {
        "id": game["id"],
        "status": "Final" if game["status"] == "Final" else game["status"],
        "period": game["period"],
        "home_team": {
            "name": game["home_team"]["full_name"],
            "score": game["home_team_score"],
            "abbreviation": game["home_team"]["abbreviation"],
            "record": home_record,
            "top_scorer": team_stats.get(
                game["home_team"]["id"],
                {"name": "N/A", "points": 0, "rebounds": 0, "assists": 0},
            ),
        },
        "visitor_team": {
            "name": game["visitor_team"]["full_name"],
            "score": game["visitor_team_score"],
            "abbreviation": game["visitor_team"]["abbreviation"],
            "record": visitor_record,
            "top_scorer": team_stats.get(
                game["visitor_team"]["id"],
                {"name": "N/A", "points": 0, "rebounds": 0, "assists": 0},
            ),
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
