import type { Film } from "@/types/film";

export function film(overrides: Partial<Film> & Pick<Film, "id" | "title">): Film {
  return {
    year: 2000,
    durationMinutes: 120,
    genre: "Dram",
    rating: 7,
    description: "Kısa bir açıklama metni.",
    posterUrl: null,
    createdAt: "2026-09-01T18:00:00.000Z",
    ...overrides,
  };
}
