import os
import time
import json
import re
import traceback
import uuid
from typing import List, Optional, Dict
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv

# Import our new database
from streamer_db import STREAMER_DB, get_available_genres

# Load environment variables
load_dotenv()

# Configure Gemini Client
api_key = os.getenv("GOOGLE_API_KEY")
client = None
if api_key and api_key != "YOUR_API_KEY_HERE" and api_key != "":
    try:
        print(f"INFO: Configuring Gemini Client with key: {api_key[:10]}...")
        client = genai.Client(api_key=api_key)
    except Exception as e:
        print(f"WARNING: Could not initialize Gemini: {str(e)}")
else:
    print("WARNING: GOOGLE_API_KEY not set or is placeholder")

app = FastAPI(title="Indie Launcher API")

# Enable CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models for Trailer Analysis ---
class AnalysisRequest(BaseModel):
    url: str
    simulate: Optional[bool] = False
    isFullAudit: Optional[bool] = False

class AnalysisResult(BaseModel):
    hookScore: int
    pacing: str
    retentionDrops: List[int]
    heatmapData: List[float]
    highlights: List[str]
    improvements: List[str]
    isFullAudit: bool

# --- Models for Streamer Sniper ---
class StreamerMatchRequest(BaseModel):
    genre: Optional[str] = "Roguelike"
    isFullAccess: Optional[bool] = False

# In-memory mapping of slugs to (genre, streamer_id)
# In production, this would be in Redis or a session-based store
SLUG_MAP: Dict[str, Dict] = {}

@app.get("/")
async def root():
    return {"message": "Indie Launcher API is running", "status": "healthy"}

# Trailer Analysis Endpoint
@app.post("/analyze-trailer", response_model=AnalysisResult)
async def analyze_trailer(request: AnalysisRequest):
    print(f"INFO: Received analysis request for: {request.url}")
    
    is_simulated = request.simulate or not client
    
    if is_simulated:
        heatmap = [40 + (i % 10) * 5 for i in range(40)]
        drops = [5, 12, 45]
        improvements = ["Add more gameplay", "Brighter colors"]
        if not request.isFullAudit:
            heatmap = heatmap[:10] + [0] * 30
            drops = [d for d in drops if d <= 10]
            improvements = ["Upgrade to Full Audit to see detailed improvements"]
        return {
            "hookScore": 88,
            "pacing": "Optimal (Simulated)",
            "retentionDrops": drops,
            "heatmapData": heatmap,
            "highlights": ["Strong hook detected", "Good pacing"],
            "improvements": improvements,
            "isFullAudit": request.isFullAudit
        }

    try:
        model_name = "gemini-1.5-flash"
        analysis_scope = "the entire trailer" if request.isFullAudit else "only the first 5-10 seconds"
        prompt = f"""
        Analyze {analysis_scope} of this game trailer URL: {request.url}
        Return the analysis ONLY in the following JSON format:
        {{
            "hookScore": (number 0-100),
            "pacing": (string description),
            "retentionDrops": (list of seconds where interest might drop),
            "heatmapData": (list of 40 numbers representing interest level 0-100 over the video),
            "highlights": (list of strings),
            "improvements": (list of strings)
        }}
        """
        
        try:
            response = client.models.generate_content(model=model_name, contents=prompt)
        except:
            response = client.models.generate_content(model="gemini-flash-latest", contents=prompt)
            
        match = re.search(r'\{.*\}', response.text, re.DOTALL)
        if match:
            result_data = json.loads(match.group())
            if not request.isFullAudit:
                result_data["heatmapData"] = result_data["heatmapData"][:10] + [0] * 30
                result_data["retentionDrops"] = [d for d in result_data["retentionDrops"] if d <= 10]
                result_data["improvements"] = ["Upgrade to Full Audit for mid-to-end trailer feedback"]
            result_data["isFullAudit"] = request.isFullAudit
            return result_data
        else:
            raise HTTPException(status_code=500, detail="AI response was not in JSON format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Streamer Sniper Endpoint
@app.post("/match-streamers")
async def match_streamers(request: StreamerMatchRequest):
    print(f"DEBUG: STREAMER_DB keys: {list(STREAMER_DB.keys())}")
    genre = request.genre if request.genre in STREAMER_DB else "Roguelike"
    print(f"DEBUG: Using genre: {genre}")
    all_streamers = STREAMER_DB.get(genre, [])
    print(f"DEBUG: Found {len(all_streamers)} streamers for {genre}")
    
    processed_streamers = []
    for index, streamer in enumerate(all_streamers):
        # Business Logic: First 3 are always free. Rest are locked unless full access.
        is_locked = index >= 3 and not request.isFullAccess
        
        # Generate a secure session slug for this lead
        # This prevents ID guessing and sharing of private leads
        s_slug = str(uuid.uuid4())
        SLUG_MAP[s_slug] = {"genre": genre, "id": streamer["id"]}
        
        processed_streamer = streamer.copy()
        processed_streamer["isLocked"] = is_locked
        processed_streamer["slug"] = s_slug
        
        if is_locked:
            processed_streamer["name"] = "Premium Creator"
            processed_streamer["reason"] = "Upgrade to Launch Kit to unlock this lead and contact info."
            
        processed_streamers.append(processed_streamer)
        
    return {
        "genre": genre,
        "count": len(processed_streamers),
        "streamers": processed_streamers,
        "availableGenres": get_available_genres()
    }

@app.get("/streamer/{slug}")
async def get_streamer_profile(slug: str):
    if slug not in SLUG_MAP:
        raise HTTPException(status_code=404, detail="Profile link expired or invalid.")
    
    mapping = SLUG_MAP[slug]
    genre_data = STREAMER_DB.get(mapping["genre"], [])
    
    # Find the streamer by real ID
    streamer = next((s for s in genre_data if s["id"] == mapping["id"]), None)
    
    if not streamer:
        raise HTTPException(status_code=404, detail="Streamer not found.")
        
    return streamer
