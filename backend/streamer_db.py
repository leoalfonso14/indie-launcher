import json
import os

# Curated Indie Streamer Database (Empty by default, populated via scraper)

# Active Database (Populated exclusively from scraped data)
STREAMER_DB = {}

def load_dynamic_data():
    """Populates the database from external JSON data."""
    global STREAMER_DB
    data_path = os.path.join(os.path.dirname(__file__), "streamer_data.json")
    if os.path.exists(data_path):
        try:
            with open(data_path, "r") as f:
                STREAMER_DB = json.load(f)
        except Exception as e:
            print(f"WARNING: Error loading dynamic streamer data: {e}")
            STREAMER_DB = {}
    else:
        print("WARNING: streamer_data.json not found. Database is empty.")
        STREAMER_DB = {}

# Initialize database
load_dynamic_data()

def get_available_genres():
    """Returns all unique genres currently in the system, plus an 'All' option."""
    return ["All"] + list(STREAMER_DB.keys())

def get_total_streamer_count():
    """Returns the total number of streamers across all genres."""
    return sum(len(streamers) for streamers in STREAMER_DB.values())
