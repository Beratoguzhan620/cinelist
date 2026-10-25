const fallbackApiUrl = "http://localhost:5174";

export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? fallbackApiUrl).replace(/\/+$/, "");

/**
 * Demo mode (EXPO_PUBLIC_DEMO=1) needs no server: the films live in the browser and start
 * from the seed data. The published web demo uses it; API_URL is then the site's base path,
 * where the seed posters are served.
 */
export const DEMO = process.env.EXPO_PUBLIC_DEMO === "1";

// Seed posters are served by json-server, so they are stored as paths relative to the API.
export function resolvePosterUrl(posterUrl: string | null | undefined): string | null {
  if (!posterUrl) return null;
  return posterUrl.startsWith("/") ? `${API_URL}${posterUrl}` : posterUrl;
}
