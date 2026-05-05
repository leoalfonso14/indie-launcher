# Indie Launcher: Data-Driven Indie Game Launch Toolkit

Indie Launcher is a specialized dashboard designed to help indie developers optimize their Steam presence and influencer outreach using AI-powered visual analysis.

## Core Modules

### 1. Trailer Hook Analysis (Phase 1)
- **Vision Engine**: Gemini 1.5 Flash (optimized for rapid video frame analysis).
- **Functionality**: Analyzes the first 5 seconds vs. the full trailer to detect pacing issues and predicted viewer drop-off points.
- **Visual Output**: Heatmap overlay showing "Hook Strength" and "Retention Risks."

### 2. Streamer Sniper (Phase 2)
- **Data Source**: Twitch/YouTube API + Scraped Historical Data.
- **Functionality**: Matches your game to streamers based on "Sub-genre Affinity" rather than just view count.
- **Metric**: "Conversion Potential" — how likely a streamer's audience is to wishlist a game like yours.

### 3. Steam SEO Optimizer (Phase 3)
- **Functionality**: Cross-references top-performing tags in your sub-genre and suggests localized tag variations for international markets (China, Brazil, etc.).

### 4. Strategic Dashboard & Management (Phase 4)
- **Mission History**: Persistent storage of previous trailer audits to track iterative improvements.
- **Creator Watchlists**: User-defined "Watchlists" (e.g., "Launch Day Targets", "RPG Specialists") to organize outreach.
- **Secure Dossiers**: Session-based GUID slugs for creator profiles to prevent database scraping and protect lead exclusivity.

## Technical Stack
- **Backend**: FastAPI (Python)
- **Frontend**: Next.js 14, Tailwind CSS, Lucide Icons
- **AI**: Google Gemini 1.5 Flash
- **Database**: PostgreSQL (planned)

## Monetization & Growth Strategy
- **Free Tier (The Hook)**: Unlimited "First 5 Seconds" analysis + 4 recommended streamers (Basic info only).
- **The Basic Audit ($29)**: Full 2-minute trailer heatmap + Complete AI improvements list.
- **The Launch Kit ($99)**: Everything in Basic + 50+ Streamer matches + Contact info + SEO Meta-tags.
- **Agency License ($299 / month)**: White-label reports + Bulk processing for 10+ games.

| Plan                | Price          | Deliverable                                                           |
| :------------------ | :------------- | :-------------------------------------------------------------------- |
| **Free Hook Check** | $0             | First 5s Heatmap + 4 Streamer Names (No contact info).                |
| **The Basic Audit** | $29 (One-time) | Full Trailer Heatmap + AI Hook Analysis + 10 Streamer Leads.          |
| **The Launch Kit**  | $99 (One-time) | Tag Optimization + 50 Leads + **Watchlist Management** + Meta Tags.   |
| **Agency License**  | $299 / month   | White-label PDF Reports + Bulk processing + **Unlimited Watchlists**. |

---

## Getting Started

Refer to [DEVELOPMENT.md](./DEVELOPMENT.md) for local setup and coding standards.
