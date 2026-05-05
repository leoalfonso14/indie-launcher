# Development Guidelines: Indie Launcher

This document contains core coding standards and rules for the Indie Launcher project. AI agents and contributors should adhere to these strictly.

## 1. TypeScript Standards

### No `any` Types
- **Strictly forbidden**: Use of the `any` type in the frontend is not allowed.
- **Action**: Always declare specific interfaces or types for props, state, and API responses.
- **Enforcement**: This is enforced via ESLint (`@typescript-eslint/no-explicit-any`: "error") and TypeScript `strict: true`.

### Component Purity
- **Rule**: React components must be pure functions.
- **Impure Functions**: Do not call impure functions like `Math.random()` or `Date.now()` during render. 
- **Solution**: Generate unpredictable data in event handlers or `useEffect` and store it in state.

## 2. Freemium Business Logic

### Free vs. Full Audit
- **Free Mode**: Limits analysis to the first 5-10 seconds of a trailer.
- **Backend Truncation**: When `isFullAudit` is false, the backend must truncate `heatmapData` (first 25% only) and filter `retentionDrops` to exclude anything after 10 seconds.
- **Frontend UI**: Must use visual "locks" (blur, lock icons, upgrade buttons) to indicate restricted data in the Free tier.

## 3. Frontend Architecture
- **Framework**: Next.js 14+ (App Router).
- **Styling**: Tailwind CSS.
- **Icons**: Lucide React.
- **Utilities**: Use the `cn` utility for class merging.

## 4. Backend Architecture
- **Framework**: FastAPI.
- **Language**: Python 3.10+.
- **AI Integration**: Gemini 1.5 Flash.
- **Environment**: Use `.env` for `GOOGLE_API_KEY`.

## 6. Secure Link Infrastructure
- **Pattern**: Profile pages must use session-based GUID slugs rather than sequential IDs.
- **Logic**: Slugs are generated in the backend during search and mapped to real IDs in an in-memory session store. 
- **Privacy**: This prevents ID scraping and ensures that profile links are only valid within a specific operational session.

## 7. HUD Design System (Neon-Tactical)
- **Palette**: Use `carbon` (#0B0E14) for backgrounds, `plasma` (#2DD4BF) for actions, and `pulse` (#F472B6) for alerts.
- **Containers**: Use the `hud-card` utility class for glassmorphism, blur effects, and consistent rounding (2xl).
- **Animations**: Prioritize premium micro-animations (duration: 700ms+) with custom easing over standard rapid transitions.
- **Copy**: Avoid technical underscores (`_`) and code-style naming. Use clean, professional English for all labels.

## 8. Intelligence Harvesting (Scraper)
- **Tool**: `backend/scripts/scraper.py`
- **Setup**: Requires a `YOUTUBE_API_KEY` in the `.env` file (Get one from Google Cloud Console).
- **Execution**: Run via `python backend/scripts/scraper.py`.
- **Workflow**: 
    1. The script harvests raw data from YouTube/Twitch.
    2. Data is normalized and saved to `backend/streamer_data.json`.
    3. `streamer_db.py` automatically merges this JSON data with the hardcoded "Elite" leads.
- **Frequency**: Recommended to run 1-2 times per month to capture emerging creators.
