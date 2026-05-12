import os
import json
import uuid
import sys
import requests
import time
from googleapiclient.discovery import build
from google import genai
from dotenv import load_dotenv

# Ensure we can import from the parent directory
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

load_dotenv()

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
TWITCH_CLIENT_ID = os.getenv("TWITCH_CLIENT_ID")
TWITCH_CLIENT_SECRET = os.getenv("TWITCH_CLIENT_SECRET")
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")

# Initialize Gemini Client for Analysis
client = None
if GEMINI_API_KEY:
    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
    except Exception as e:
        print(f"WARNING: AI Analysis disabled: {e}")

def analyze_creators_batch(creators_batch, genre):
    """Uses Gemini to analyze a batch of creators to save rate limits."""
    if not client:
        return [ {
            "reason": f"Active creator in the {genre} space.",
            "tags": [genre, "Discovery"],
            "email": "Unknown",
            "discord": "Unknown"
        } for _ in creators_batch ]
    
    batch_text = ""
    for i, c in enumerate(creators_batch):
        batch_text += f"CREATOR {i}:\nName: {c['name']}\nPlatform: {c['platform']}\nStats: {c['avgViewers']}\nDescription: {c.get('description', 'N/A')[:500]}\n---\n"

    prompt = f"""
    Analyze these gaming creators for an indie game launcher (Genre: {genre}).
    
    CRITICAL INSTRUCTION: Look closely at the 'Stats'. 
    - If a creator has >1M subs/viewers, treat them as a 'COLOSSUS' or 'MAJOR HUB'. 
    - Never call a creator with millions or hundreds of thousands of followers 'small'. 
    - Tailor the 'reason' to their actual size (e.g., massive reach vs. niche engagement).

    {batch_text}

    For EACH creator:
    1. Write a professional 2 sentence 'Strategic Reason' for targeting them.
    2. Suggest 3 highly relevant tags (e.g., 'Lore Expert', 'Hardcore').
    3. Extract any REAL email or Discord from the description.

    Return ONLY a JSON list of objects:
    [
        {{ "reason": "...", "tags": ["...", "...", "..."], "email": "...", "discord": "..." }},
        ...
    ]
    """
    
    # Respect rate limits
    print(f"      [AI] Cooling down (20s)...")
    time.sleep(20)
    
    try:
        response = client.models.generate_content(model="gemini-3.1-flash-lite-preview", contents=prompt)
        import re
        match = re.search(r'\[.*\]', response.text, re.DOTALL)
        if match:
            return json.loads(match.group())
    except Exception as e:
        print(f"WARNING: Batch analysis failed: {e}")
            
    return [{"reason": "Manual review required.", "tags": [genre], "email": "Unknown", "discord": "Unknown"}] * len(creators_batch)

def get_twitch_access_token():
    if not TWITCH_CLIENT_ID or not TWITCH_CLIENT_SECRET: return None
    url = "https://id.twitch.tv/oauth2/token"
    params = {"client_id": TWITCH_CLIENT_ID, "client_secret": TWITCH_CLIENT_SECRET, "grant_type": "client_credentials"}
    try:
        response = requests.post(url, params=params)
        return response.json().get("access_token")
    except: return None

def get_twitch_creators(genre, count=5):
    token = get_twitch_access_token()
    if not token or not TWITCH_CLIENT_ID: return []
    
    # Search for channels
    url = "https://api.twitch.tv/helix/search/channels"
    headers = {"Client-ID": TWITCH_CLIENT_ID, "Authorization": f"Bearer {token}"}
    params = {"query": genre, "first": count}
    
    try:
        response = requests.get(url, headers=headers, params=params)
        data = response.json()
        creators = []
        
        for c in data.get("data", []):
            # Fetch Broadcaster stats for viewership proxy
            b_id = c["id"]
            v_url = f"https://api.twitch.tv/helix/videos?user_id={b_id}&first=5&type=archive"
            v_resp = requests.get(v_url, headers=headers).json()
            
            # Calculate average VOD views as a proxy for "Average Viewership"
            v_data = v_resp.get("data", [])
            avg_views = 0
            if v_data:
                total_views = sum([v.get("view_count", 0) for v in v_data])
                avg_views = total_views // len(v_data)
            
            view_text = f"~{avg_views} avg views" if avg_views > 0 else "Active Streamer"
            if avg_views > 1000: view_text = f"~{avg_views/1000:.1f}k avg views"

            creators.append({
                "name": c["display_name"],
                "platform": "twitch",
                "avgViewers": view_text,
                "description": c.get("game_name", ""),
                "matchScore": 85,
                "conversionPotential": "High" if avg_views < 2000 else "Medium"
            })
        return creators
    except: return []

def get_youtube_creators(genre, count=10):
    if not YOUTUBE_API_KEY: return []
    try:
        youtube = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)
        search_response = youtube.search().list(q=f"{genre} indie game", part="snippet", maxResults=count, type="video").execute()
        creators = []
        for item in search_response.get("items", []):
            cid = item["snippet"]["channelId"]
            c_info = youtube.channels().list(id=cid, part="statistics,snippet").execute()["items"][0]
            subs = int(c_info["statistics"].get("subscriberCount", "0"))
            
            # Better formatting for subs
            if subs >= 1000000: subs_text = f"{subs/1000000:.1f}M subs"
            elif subs >= 1000: subs_text = f"{subs/1000:.0f}k subs"
            else: subs_text = str(subs)

            creators.append({
                "name": c_info["snippet"]["title"],
                "platform": "youtube",
                "avgViewers": subs_text,
                "description": c_info["snippet"].get("description", ""),
                "matchScore": 82,
                "conversionPotential": "High" if subs < 100000 else "Medium",
                "subs_raw": subs
            })
        return creators
    except: return []

def run_harvester(target_genre=None):
    print("\n" + "="*50)
    print("   INDIE LAUNCHER: AI STRATEGIC HARVEST")
    print("="*50 + "\n")
    
    genres = [target_genre] if target_genre else ["Roguelike", "Metroidvania", "Cozy / Farm Sim", "Strategy / Sim", "Deckbuilder", "Soulslike / Action", "Horror", "Puzzle / Brain"]
    data_path = os.path.join(os.path.dirname(__file__), "..", "streamer_data.json")
    
    for genre in genres:
        print(f"[*] Analyzing: {genre}")
        raw_leads = get_youtube_creators(genre) + get_twitch_creators(genre)
        
        all_data = {}
        if os.path.exists(data_path):
            with open(data_path, "r") as f: all_data = json.load(f)
            
        existing_names = {c["name"] for c in all_data.get(genre, [])}
        new_leads = [c for c in raw_leads if c["name"] not in existing_names]
        
        if not new_leads:
            print("    - No new leads for this sector.")
            continue
            
        if genre not in all_data: all_data[genre] = []
        
        for i in range(0, len(new_leads), 5):
            batch = new_leads[i:i+5]
            print(f"      [AI] Analyzing squad {i//5 + 1} of {len(new_leads)//5 + 1}...")
            analyses = analyze_creators_batch(batch, genre)
            
            for j, lead in enumerate(batch):
                analysis = analyses[j] if j < len(analyses) else analyses[-1]
                all_data[genre].append({
                    "id": f"{lead['platform'][0]}t-h-{uuid.uuid4().hex[:6]}",
                    "name": lead["name"],
                    "platform": lead["platform"],
                    "matchScore": lead["matchScore"],
                    "conversionPotential": lead["conversionPotential"],
                    "tags": analysis.get("tags", [genre]),
                    "avgViewers": lead["avgViewers"],
                    "reason": analysis.get("reason", "Strategic match."),
                    "email": analysis.get("email") or "Discovery Pending",
                    "discord": analysis.get("discord") or "Discovery Pending"
                })
            
            with open(data_path, "w") as f: json.dump(all_data, f, indent=4)
            print(f"      [SUCCESS] Batch saved.")
        
    print(f"\n[MISSION COMPLETE] Results in {data_path}")

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else None
    run_harvester(target)
