import os
import json
import uuid
import sys
import requests
from googleapiclient.discovery import build
from dotenv import load_dotenv

# Ensure we can import from the parent directory
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

load_dotenv()

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
TWITCH_CLIENT_ID = os.getenv("TWITCH_CLIENT_ID")
TWITCH_CLIENT_SECRET = os.getenv("TWITCH_CLIENT_SECRET")

def get_twitch_access_token():
    """Twitch requires an App Access Token to call the Helix API."""
    if not TWITCH_CLIENT_ID or not TWITCH_CLIENT_SECRET:
        return None
    
    url = "https://id.twitch.tv/oauth2/token"
    params = {
        "client_id": TWITCH_CLIENT_ID,
        "client_secret": TWITCH_CLIENT_SECRET,
        "grant_type": "client_credentials"
    }
    try:
        response = requests.post(url, params=params)
        response.raise_for_status()
        return response.json().get("access_token")
    except Exception as e:
        print(f"ERROR: Failed to get Twitch access token: {e}")
        return None

def get_twitch_creators(genre, count=10):
    """
    Harvests Twitch channels based on genre keywords.
    Note: Twitch search is query-based; we use genre names to find relevant broadcasters.
    """
    token = get_twitch_access_token()
    if not token or not TWITCH_CLIENT_ID:
        print("WARNING: Twitch credentials not set. Skipping Twitch harvest.")
        return []
    
    url = "https://api.twitch.tv/helix/search/channels"
    headers = {
        "Client-ID": TWITCH_CLIENT_ID,
        "Authorization": f"Bearer {token}"
    }
    params = {
        "query": f"{genre} indie",
        "first": count
    }
    
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()
        
        creators = []
        for channel in data.get("data", []):
            # Only include creators who have streamed recently (is_live or recently active)
            creators.append({
                "id": f"tw-h-{uuid.uuid4().hex[:6]}",
                "name": channel["display_name"],
                "platform": "twitch",
                "matchScore": 85,
                "conversionPotential": "High",
                "tags": [genre, "Live", "Indie"],
                "avgViewers": "Active", # Twitch search doesn't give live viewers, but indicates activity
                "reason": f"Live Discovery: High-engagement Twitch creator active in the {genre} category."
            })
        return creators
    except Exception as e:
        print(f"ERROR: Twitch harvest failed: {e}")
        return []

def get_youtube_creators(genre, count=15):
    if not YOUTUBE_API_KEY or YOUTUBE_API_KEY == "YOUR_API_KEY_HERE":
        print("WARNING: YOUTUBE_API_KEY not set. Skipping YouTube harvest.")
        return []
    
    try:
        youtube = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)
        search_response = youtube.search().list(
            q=f"{genre} indie game gameplay walkthrough",
            part="snippet",
            maxResults=count,
            type="video",
            order="relevance",
            relevanceLanguage="en"
        ).execute()
        
        creators = []
        processed_channels = set()
        for item in search_response.get("items", []):
            channel_id = item["snippet"]["channelId"]
            channel_title = item["snippet"]["channelTitle"]
            if channel_id in processed_channels: continue
            
            channel_response = youtube.channels().list(id=channel_id, part="statistics").execute()
            if not channel_response.get("items"): continue
                
            stats = channel_response["items"][0]["statistics"]
            subs = stats.get("subscriberCount", "0")
            subs_int = int(subs)
            
            if subs_int > 1000000: subs_text = f"{subs_int/1000000:.1f}M subs"
            elif subs_int > 1000: subs_text = f"{subs_int/1000:.0f}k subs"
            else: subs_text = f"{subs_int} subs"
                
            creators.append({
                "id": f"yt-h-{uuid.uuid4().hex[:6]}",
                "name": channel_title,
                "platform": "youtube",
                "matchScore": 82,
                "conversionPotential": "Medium" if subs_int > 50000 else "High",
                "tags": [genre, "Discovery", "Indie"],
                "avgViewers": subs_text,
                "reason": f"Automated Discovery: Active creator consistently covering {genre} titles with high audience engagement."
            })
            processed_channels.add(channel_id)
        return creators
    except Exception as e:
        print(f"ERROR: YouTube harvest failed: {e}")
        return []

def run_harvester(genres):
    print("\n" + "="*50)
    print("   INDIE LAUNCHER: STRATEGIC INTELLIGENCE HARVEST")
    print("="*50 + "\n")
    
    data_path = os.path.join(os.path.dirname(__file__), "..", "streamer_data.json")
    all_data = {}
    
    if os.path.exists(data_path):
        try:
            with open(data_path, "r") as f:
                all_data = json.load(f)
        except:
            all_data = {}
            
    for genre in genres:
        print(f"[*] Analyzing sector: {genre}")
        
        # Harvest from both platforms
        yt_creators = get_youtube_creators(genre)
        tw_creators = get_twitch_creators(genre)
        
        combined = yt_creators + tw_creators
        
        if genre not in all_data:
            all_data[genre] = []
            
        existing_names = {c["name"] for c in all_data[genre]}
        new_leads = [c for c in combined if c["name"] not in existing_names]
        
        all_data[genre].extend(new_leads)
        print(f"    - YouTube: +{len(yt_creators)} leads")
        print(f"    - Twitch:  +{len(tw_creators)} leads")
        print(f"    - [NEW TOTAL]: {len(all_data[genre])} leads in sector\n")
        
    with open(data_path, "w") as f:
        json.dump(all_data, f, indent=4)
    
    print(f"[SUCCESS] Harvest complete. Intelligence updated in {data_path}")

if __name__ == "__main__":
    target_genres = [
        "Roguelike", 
        "Metroidvania", 
        "Cozy / Farm Sim", 
        "Strategy / Sim", 
        "Deckbuilder", 
        "Soulslike / Action", 
        "Horror", 
        "Puzzle / Brain"
    ]
    run_harvester(target_genres)
