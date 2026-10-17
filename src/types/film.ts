export const GENRES = [
  "Aksiyon",
  "Animasyon",
  "Bilim kurgu",
  "Belgesel",
  "Dram",
  "Fantastik",
  "Gerilim",
  "Komedi",
  "Korku",
  "Macera",
  "Romantik",
  "Suç",
] as const;

export type Genre = (typeof GENRES)[number];

export type Film = {
  id: string;
  title: string;
  year: number;
  durationMinutes: number;
  genre: Genre;
  rating: number;
  description: string;
  posterUrl: string | null;
  createdAt: string;
};

export type FilmInput = Omit<Film, "id" | "createdAt">;
