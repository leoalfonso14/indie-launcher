/**
 * Strategic API Configuration
 *
 * This utility manages the connection between the Frontend and Backend.
 * - In Production (Vercel): It automatically uses the Deployed Backend.
 * - In Development (Local): It defaults to your local FastAPI server.
 */

const DEPLOYED_BACKEND = process.env.NEXT_PUBLIC_API_URL;
const LOCAL_BACKEND = "http://127.0.0.1:8000";
const USE_LOCAL = true;

// Standard Next.js environment check
const IS_PRODUCTION = process.env.NODE_ENV === "production";

/**
 * Logic:
 * 1. If we are on Vercel (Production), ALWAYS use the Deployed Backend.
 * 2. If we are local, use the Deployed Backend ONLY if it's set in .env.local,
 *    otherwise fall back to Localhost.
 */
export const API_BASE_URL = IS_PRODUCTION
  ? DEPLOYED_BACKEND || LOCAL_BACKEND // Safety fallback
  : USE_LOCAL
    ? LOCAL_BACKEND
    : DEPLOYED_BACKEND;

// Note: If you want to test your DEPLOYED backend while running locally:
// Simply paste the URL into your frontend/.env.local file!

console.log(
  `[NETWORK] IndieLauncher.AI (${process.env.NODE_ENV}) connected to: ${API_BASE_URL}`,
);
