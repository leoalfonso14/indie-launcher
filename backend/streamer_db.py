import json
import os

# Curated Indie Streamer Database (Hardcoded Fallback)
HARDCODED_DB = {
    "Roguelike": [
        {"id": "rl-1", "name": "Retromation", "platform": "youtube", "matchScore": 99, "conversionPotential": "High", "tags": ["Roguelike", "Strategy", "Indie"], "avgViewers": "150k subs", "reason": "The gold standard for indie roguelike coverage. High wishlist conversion."},
        {"id": "rl-2", "name": "Northernlion", "platform": "twitch", "matchScore": 95, "conversionPotential": "High", "tags": ["Roguelike", "Variety", "Entertainer"], "avgViewers": "10k+", "reason": "Massive reach in the roguelike space. Can single-handedly make a game trend."},
        {"id": "rl-3", "name": "Wanderbots", "platform": "youtube", "matchScore": 92, "conversionPotential": "High", "tags": ["Roguelike", "Indie", "Co-op"], "avgViewers": "400k subs", "reason": "Deep dives into indie mechanics. Very loyal core audience."},
        {"id": "rl-4", "name": "Olexa", "platform": "youtube", "matchScore": 88, "conversionPotential": "Medium", "tags": ["Roguelike", "Hidden Gems"], "avgViewers": "100k subs", "reason": "Passionate about finding overlooked roguelike mechanics."},
        {"id": "rl-5", "name": "BeardBear", "platform": "youtube", "matchScore": 85, "conversionPotential": "Medium", "tags": ["Walkthrough", "Indie"], "avgViewers": "500k subs", "reason": "Excellent for pure visibility and gameplay showcase."},
        {"id": "rl-6", "name": "Esty8nine", "platform": "twitch", "matchScore": 82, "conversionPotential": "High", "tags": ["Roguelike", "Hardcore"], "avgViewers": "800", "reason": "Very high engagement with tactical indie fans."},
        {"id": "rl-7", "name": "Sinvicta", "platform": "youtube", "matchScore": 80, "conversionPotential": "High", "tags": ["Isaac", "Roguelike"], "avgViewers": "250k subs", "reason": "The Isaac specialist. Perfect for any game with item-synergy mechanics."},
        {"id": "rl-8", "name": "BaerTaffy", "platform": "twitch", "matchScore": 78, "conversionPotential": "Medium", "tags": ["Roguelike", "Variety"], "avgViewers": "1.2k", "reason": "Consistent supporter of indie devs for over a decade."},
        {"id": "rl-9", "name": "Hutts", "platform": "youtube", "matchScore": 75, "conversionPotential": "Medium", "tags": ["Chaos", "Roguelike"], "avgViewers": "700k subs", "reason": "Great for high-energy, personality-driven gameplay videos."}
    ],
    "Metroidvania": [
        {"id": "mv-1", "name": "Reliance", "platform": "youtube", "matchScore": 98, "conversionPotential": "High", "tags": ["Metroidvania", "Hollow Knight", "Lore"], "avgViewers": "40k subs", "reason": "Deeply analytical audience that loves complex level design and lore-heavy games."},
        {"id": "mv-2", "name": "The de_dusty", "platform": "twitch", "matchScore": 93, "conversionPotential": "Medium", "tags": ["Speedruns", "Metroidvania", "Hardcore"], "avgViewers": "1.5k", "reason": "Incredible skill. Best for games that have high mechanical depth."},
        {"id": "mv-3", "name": "Indie Game Shelf", "platform": "youtube", "matchScore": 89, "conversionPotential": "High", "tags": ["Hidden Gems", "Platformers"], "avgViewers": "12k subs", "reason": "Focuses on 'hidden gem' platformers. Audience is always looking for the next big indie hit."},
        {"id": "mv-4", "name": "Rusty Supergiant", "platform": "youtube", "matchScore": 86, "conversionPotential": "Medium", "tags": ["Metroidvania", "Retrospective"], "avgViewers": "25k subs", "reason": "Excellent for long-form video essays on design."},
        {"id": "mv-5", "name": "Fireb0rn", "platform": "twitch", "matchScore": 84, "conversionPotential": "High", "tags": ["Hollow Knight", "Hardcore"], "avgViewers": "2k", "reason": "High-skill ceiling audience. Perfect for difficult platformers."},
        {"id": "mv-6", "name": "CajunAvenger", "platform": "twitch", "matchScore": 81, "conversionPotential": "Medium", "tags": ["Metroidvania", "Retro"], "avgViewers": "400", "reason": "Very high community interaction and niche focus."},
        {"id": "mv-7", "name": "Locked MV Lead G", "platform": "youtube", "matchScore": 79, "conversionPotential": "Medium", "tags": ["Exploration", "Indie"], "avgViewers": "5k subs", "reason": "Premium Lead: Focuses on non-linear exploration games."},
        {"id": "mv-8", "name": "Locked MV Lead H", "platform": "twitch", "matchScore": 76, "conversionPotential": "Low", "tags": ["Variety", "Indie"], "avgViewers": "1k", "reason": "Premium Lead: Broad indie reach with platformer interest."},
        {"id": "mv-9", "name": "Locked MV Lead I", "platform": "youtube", "matchScore": 72, "conversionPotential": "Medium", "tags": ["Review", "Metroidvania"], "avgViewers": "10k subs", "reason": "Premium Lead: Professional review style for the MV genre."}
    ],
    "Cozy / Farm Sim": [
        {"id": "cz-1", "name": "Eevee G", "platform": "youtube", "matchScore": 98, "conversionPotential": "High", "tags": ["Cozy", "Farm Sim", "Stardew-like"], "avgViewers": "80k subs", "reason": "Primary influencer for the 'Cozy' aesthetic. Audience buys everything she recommends."},
        {"id": "cz-2", "name": "Cozy Games with K", "platform": "twitch", "matchScore": 94, "conversionPotential": "High", "tags": ["Cozy", "Wholesome", "Indie"], "avgViewers": "500", "reason": "Smaller but incredibly dedicated community focused on wholesome titles."},
        {"id": "cz-3", "name": "Sharky", "platform": "youtube", "matchScore": 90, "conversionPotential": "Medium", "tags": ["Building", "Creative", "Indie"], "avgViewers": "100k subs", "reason": "Loves creative builders and management sims."},
        {"id": "cz-4", "name": "Pebbles", "platform": "twitch", "matchScore": 87, "conversionPotential": "High", "tags": ["Cozy", "Community"], "avgViewers": "300", "reason": "Ultra-loyal community. High wishlist conversion per viewer."},
        {"id": "cz-5", "name": "Seri! Pixel Biologist", "platform": "youtube", "matchScore": 84, "conversionPotential": "Medium", "tags": ["Nature", "Sim"], "avgViewers": "150k subs", "reason": "Perfect for games involving animals, nature, or biology."},
        {"id": "cz-6", "name": "Aveline", "platform": "youtube", "matchScore": 81, "conversionPotential": "High", "tags": ["Cozy", "Aesthetics"], "avgViewers": "60k subs", "reason": "High-production value showcases for beautiful indie games."},
        {"id": "cz-7", "name": "Locked Cozy G", "platform": "twitch", "matchScore": 78, "conversionPotential": "Medium", "tags": ["Variety", "Cozy"], "avgViewers": "1.2k", "reason": "Premium Lead: Great for weekend 'Cozy' marathons."},
        {"id": "cz-8", "name": "Locked Cozy H", "platform": "youtube", "matchScore": 75, "conversionPotential": "Medium", "tags": ["Simulation", "Indie"], "avgViewers": "15k subs", "reason": "Premium Lead: Deep dives into farming mechanics."},
        {"id": "cz-9", "name": "Locked Cozy I", "platform": "twitch", "matchScore": 72, "conversionPotential": "Low", "tags": ["Chill", "Variety"], "avgViewers": "2k", "reason": "Premium Lead: Relaxed atmosphere for gameplay showcases."}
    ],
    "Strategy / Sim": [
        {"id": "st-1", "name": "SplatterCatGaming", "platform": "youtube", "matchScore": 99, "conversionPotential": "High", "tags": ["Strategy", "Management", "Simulation"], "avgViewers": "900k subs", "reason": "The absolute king of indie strategy discovery. A 'Splat' video is a guaranteed sales spike."},
        {"id": "st-2", "name": "Real Civil Engineer", "platform": "youtube", "matchScore": 95, "conversionPotential": "High", "tags": ["Building", "Physics", "Strategy"], "avgViewers": "2M subs", "reason": "Massive reach for engineering and physics-based building games."},
        {"id": "st-3", "name": "Blitz", "platform": "youtube", "matchScore": 92, "conversionPotential": "Medium", "tags": ["Strategy", "Simulation", "Funny"], "avgViewers": "3M subs", "reason": "Huge general audience. Best for 'fun' and 'chaotic' strategy games."},
        {"id": "st-4", "name": "Arumba", "platform": "twitch", "matchScore": 88, "conversionPotential": "High", "tags": ["Grand Strategy", "Math"], "avgViewers": "1.5k", "reason": "Perfect for complex, number-heavy simulation games."},
        {"id": "st-5", "name": "KatherineOfSky", "platform": "youtube", "matchScore": 85, "conversionPotential": "High", "tags": ["Automation", "Strategy"], "avgViewers": "140k subs", "reason": "The queen of automation games (Factorio style). High conversion."},
        {"id": "st-6", "name": "Nookrium", "platform": "youtube", "matchScore": 82, "conversionPotential": "Medium", "tags": ["Retro", "Strategy", "Indie"], "avgViewers": "100k subs", "reason": "Loves deep, complex indie strategy and simulation gems."},
        {"id": "st-7", "name": "Locked Strat G", "platform": "twitch", "matchScore": 79, "conversionPotential": "Medium", "tags": ["4X", "Strategy"], "avgViewers": "2k", "reason": "Premium Lead: Focused on 4X and turn-based strategy."},
        {"id": "st-8", "name": "Locked Strat H", "platform": "youtube", "matchScore": 76, "conversionPotential": "Medium", "tags": ["City Builder"], "avgViewers": "50k subs", "reason": "Premium Lead: Specialist in city building and management."},
        {"id": "st-9", "name": "Locked Strat I", "platform": "twitch", "matchScore": 73, "conversionPotential": "Low", "tags": ["Variety"], "avgViewers": "5k", "reason": "Premium Lead: Wide reach for trending strategy titles."}
    ],
    "Deckbuilder": [
        {"id": "db-1", "name": "Baalorlord", "platform": "twitch", "matchScore": 99, "conversionPotential": "High", "tags": ["Deckbuilder", "Strategy", "Slay the Spire"], "avgViewers": "1.5k", "reason": "Elite strategy analysis. If your deckbuilder has depth, he will showcase it perfectly."},
        {"id": "db-2", "name": "Rhapsody", "platform": "youtube", "matchScore": 94, "conversionPotential": "High", "tags": ["Deckbuilder", "Roguelike", "Indie"], "avgViewers": "100k subs", "reason": "Excellent walkthroughs and strategy guides. Very high conversion rate for tactical games."},
        {"id": "db-3", "name": "Jorbs", "platform": "twitch", "matchScore": 91, "conversionPotential": "High", "tags": ["Deckbuilder", "Strategy", "Analytical"], "avgViewers": "2k", "reason": "Deep, philosophical approach to game systems. Highly trusted by tactical fans."},
        {"id": "db-4", "name": "FrostPrime", "platform": "youtube", "matchScore": 88, "conversionPotential": "Medium", "tags": ["Variety", "Deckbuilder"], "avgViewers": "500k subs", "reason": "High personality coverage. Great for entertainment value."},
        {"id": "db-5", "name": "SneakySly", "platform": "twitch", "matchScore": 85, "conversionPotential": "Medium", "tags": ["Deckbuilder", "Indie"], "avgViewers": "300", "reason": "Niche focus on new and experimental indie deckbuilders."},
        {"id": "db-6", "name": "Locked DB Lead F", "platform": "youtube", "matchScore": 82, "conversionPotential": "High", "tags": ["Strategy", "Cards"], "avgViewers": "20k subs", "reason": "Premium Lead: Focuses on card-based mechanics and ROI."},
        {"id": "db-7", "name": "Locked DB Lead G", "platform": "twitch", "matchScore": 79, "conversionPotential": "Medium", "tags": ["Variety"], "avgViewers": "1k", "reason": "Premium Lead: Good for general indie tactical reach."},
        {"id": "db-8", "name": "Locked DB Lead H", "platform": "youtube", "matchScore": 76, "conversionPotential": "Low", "tags": ["Lets Play"], "avgViewers": "50k subs", "reason": "Premium Lead: General gameplay focus for card games."},
        {"id": "db-9", "name": "Locked DB Lead I", "platform": "twitch", "matchScore": 73, "conversionPotential": "Medium", "tags": ["Competitive"], "avgViewers": "2k", "reason": "Premium Lead: Focuses on competitive indie card systems."}
    ],
    "Soulslike / Action": [
        {"id": "sl-1", "name": "LobosJr", "platform": "twitch", "matchScore": 99, "conversionPotential": "High", "tags": ["Soulslike", "Hardcore", "Challenge"], "avgViewers": "3k", "reason": "The face of hardcore indie action. If your combat is good, he will find it."},
        {"id": "sl-2", "name": "FightinCowboy", "platform": "youtube", "matchScore": 96, "conversionPotential": "High", "tags": ["Action RPG", "Walkthrough", "Indie"], "avgViewers": "1.2M subs", "reason": "Massive reach for Action RPGs. Excellent for visibility."},
        {"id": "sl-3", "name": "Prod", "platform": "youtube", "matchScore": 92, "conversionPotential": "Medium", "tags": ["Soulslike", "Funny", "Indie"], "avgViewers": "400k subs", "reason": "High-energy horror and action coverage. Great for 'Souls' fans."},
        {"id": "sl-4", "name": "VaatiVidya", "platform": "youtube", "matchScore": 89, "conversionPotential": "High", "tags": ["Lore", "Soulslike"], "avgViewers": "3M subs", "reason": "The lore master. Only covers the most atmospheric indie soulslikes."},
        {"id": "sl-5", "name": "Oroboro", "platform": "twitch", "matchScore": 86, "conversionPotential": "Medium", "tags": ["PvP", "Action"], "avgViewers": "1.5k", "reason": "Focuses on high-skill action and combat systems."},
        {"id": "sl-6", "name": "Fextralife", "platform": "twitch", "matchScore": 83, "conversionPotential": "High", "tags": ["RPG", "Action"], "avgViewers": "20k", "reason": "Massive platform for RPG discovery. Incredible for day-one reach."},
        {"id": "sl-7", "name": "Locked Soul G", "platform": "youtube", "matchScore": 80, "conversionPotential": "Medium", "tags": ["Action", "Indie"], "avgViewers": "10k subs", "reason": "Premium Lead: Focuses on pixel-art action and dodge-heavy combat."},
        {"id": "sl-8", "name": "Locked Soul H", "platform": "twitch", "matchScore": 77, "conversionPotential": "Low", "tags": ["Variety"], "avgViewers": "3k", "reason": "Premium Lead: Broad reach for trending action titles."},
        {"id": "sl-9", "name": "Locked Soul I", "platform": "youtube", "matchScore": 74, "conversionPotential": "Medium", "tags": ["Review"], "avgViewers": "25k subs", "reason": "Premium Lead: Professional critic for the action genre."}
    ],
    "Horror": [
        {"id": "hr-1", "name": "Insym", "platform": "twitch", "matchScore": 99, "conversionPotential": "High", "tags": ["Horror", "Detective", "Indie"], "avgViewers": "12k", "reason": "The king of indie horror. If he plays it, it explodes on Steam."},
        {"id": "hr-2", "name": "John Wolfe", "platform": "youtube", "matchScore": 97, "conversionPotential": "High", "tags": ["Horror", "Skeptical", "Indie"], "avgViewers": "1M subs", "reason": "Analytical horror reviews. High trust from a massive audience."},
        {"id": "hr-3", "name": "Markiplier", "platform": "youtube", "matchScore": 94, "conversionPotential": "High", "tags": ["Horror", "Indie", "Legend"], "avgViewers": "36M subs", "reason": "The king. A single video can change a developer's life forever."},
        {"id": "hr-4", "name": "CoryxKenshin", "platform": "youtube", "matchScore": 91, "conversionPotential": "High", "tags": ["Horror", "Funny"], "avgViewers": "18M subs", "reason": "Incredible engagement for spooky indie games."},
        {"id": "hr-5", "name": "The Librarian", "platform": "youtube", "matchScore": 88, "conversionPotential": "High", "tags": ["Atmosphere", "Indie"], "avgViewers": "200k subs", "reason": "Focuses on atmospheric, obscure, and psychological horror."},
        {"id": "hr-6", "name": "Gab Smolders", "platform": "youtube", "matchScore": 85, "conversionPotential": "Medium", "tags": ["Horror", "Mystery"], "avgViewers": "1M subs", "reason": "Excellent for narrative-driven horror and puzzles."},
        {"id": "hr-7", "name": "Locked Horror G", "platform": "twitch", "matchScore": 82, "conversionPotential": "Medium", "tags": ["Jump Scares"], "avgViewers": "5k", "reason": "Premium Lead: High-energy reactions for scary titles."},
        {"id": "hr-8", "name": "Locked Horror H", "platform": "youtube", "matchScore": 79, "conversionPotential": "Low", "tags": ["Variety"], "avgViewers": "100k subs", "reason": "Premium Lead: Broad horror reach for general fans."},
        {"id": "hr-9", "name": "Locked Horror I", "platform": "twitch", "matchScore": 76, "conversionPotential": "Medium", "tags": ["Retro Horror"], "avgViewers": "1k", "reason": "Premium Lead: Focuses on PS1-style and retro indie horror."}
    ],
    "Puzzle / Brain": [
        {"id": "pz-1", "name": "Aliensrock", "platform": "youtube", "matchScore": 98, "conversionPotential": "High", "tags": ["Puzzle", "Logic", "Strategy"], "avgViewers": "500k subs", "reason": "Massive reach for high-concept puzzle games. Loves complex logic and unique mechanics."},
        {"id": "pz-2", "name": "ICELY Puzzles", "platform": "youtube", "matchScore": 92, "conversionPotential": "Medium", "tags": ["Puzzle", "Relaxing", "Indie"], "avgViewers": "200k subs", "reason": "Pure puzzle focus. Audience is exclusively interested in brain teasers."},
        {"id": "pz-3", "name": "The Lorelei", "platform": "twitch", "matchScore": 89, "conversionPotential": "High", "tags": ["Puzzle", "Community"], "avgViewers": "200", "reason": "Very high community puzzle-solving engagement. Perfect for ARG-like indies."},
        {"id": "pz-4", "name": "Locked Puzzle D", "platform": "youtube", "matchScore": 86, "conversionPotential": "Medium", "tags": ["Logic", "Math"], "avgViewers": "50k subs", "reason": "Premium Lead: Focuses on mathematical and logical brain games."},
        {"id": "pz-5", "name": "Locked Puzzle E", "platform": "twitch", "matchScore": 83, "conversionPotential": "Medium", "tags": ["Variety"], "avgViewers": "1.5k", "reason": "Premium Lead: Good for general interest in puzzle-platformers."},
        {"id": "pz-6", "name": "Locked Puzzle F", "platform": "youtube", "matchScore": 80, "conversionPotential": "Low", "tags": ["Indie"], "avgViewers": "10k subs", "reason": "Premium Lead: Professional reviewer for the puzzle genre."},
        {"id": "pz-7", "name": "Locked Puzzle G", "platform": "twitch", "matchScore": 77, "conversionPotential": "Medium", "tags": ["Puzzle"], "avgViewers": "500", "reason": "Premium Lead: Dedicated puzzle community for niche indie titles."},
        {"id": "pz-8", "name": "Locked Puzzle H", "platform": "youtube", "matchScore": 74, "conversionPotential": "Medium", "tags": ["Educational"], "avgViewers": "30k subs", "reason": "Premium Lead: Great for games that teach logic or science."},
        {"id": "pz-9", "name": "Locked Puzzle I", "platform": "twitch", "matchScore": 71, "conversionPotential": "Low", "tags": ["Chill"], "avgViewers": "3k", "reason": "Premium Lead: Relaxed gameplay sessions for easy-to-learn puzzles."}
    ]
}

# Active Database (Combined curated + dynamic)
STREAMER_DB = HARDCODED_DB.copy()

def load_dynamic_data():
    """Merges external JSON data into the active database."""
    global STREAMER_DB
    data_path = os.path.join(os.path.dirname(__file__), "streamer_data.json")
    if os.path.exists(data_path):
        try:
            with open(data_path, "r") as f:
                dynamic_data = json.load(f)
                for genre, streamers in dynamic_data.items():
                    if genre in STREAMER_DB:
                        # Avoid duplicates by ID
                        existing_ids = {s["id"] for s in STREAMER_DB[genre]}
                        for s in streamers:
                            if s["id"] not in existing_ids:
                                STREAMER_DB[genre].append(s)
                    else:
                        STREAMER_DB[genre] = streamers
        except Exception as e:
            print(f"WARNING: Error loading dynamic streamer data: {e}")

# Initialize database
load_dynamic_data()

def get_available_genres():
    """Returns all unique genres currently in the system."""
    return list(STREAMER_DB.keys())
