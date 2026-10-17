const fallbackApiUrl = "http://localhost:5174";

export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? fallbackApiUrl).replace(/\/+$/, "");

// Seed posters are served by json-server, so they are stored as paths relative to the API.
export function resolvePosterUrl(posterUrl: string | null | undefined): string | null {
  if (!posterUrl) return null;
  return posterUrl.startsWith("/") ? `${API_URL}${posterUrl}` : posterUrl;
}
