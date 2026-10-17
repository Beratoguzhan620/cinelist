import type { SortOrder } from "@/store/preferencesSlice";
import type { Film, Genre } from "@/types/film";

export const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: "newest", label: "Son eklenen" },
  { value: "rating", label: "Puan (yüksekten düşüğe)" },
  { value: "year", label: "Yıl (yeniden eskiye)" },
  { value: "title", label: "Ada göre (A–Z)" },
];

export type FilmFilter = {
  query: string;
  genre: Genre | null;
};

function normalize(text: string): string {
  return text.toLocaleLowerCase("tr").normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

export function filterFilms(films: readonly Film[], { query, genre }: FilmFilter): Film[] {
  const needle = normalize(query);
  return films.filter(
    (film) => (genre === null || film.genre === genre) && (needle === "" || normalize(film.title).includes(needle)),
  );
}

const comparers: Record<SortOrder, (a: Film, b: Film) => number> = {
  newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  rating: (a, b) => b.rating - a.rating || a.title.localeCompare(b.title, "tr"),
  year: (a, b) => b.year - a.year || a.title.localeCompare(b.title, "tr"),
  title: (a, b) => a.title.localeCompare(b.title, "tr"),
};

export function sortFilms(films: readonly Film[], order: SortOrder): Film[] {
  return [...films].sort(comparers[order]);
}

export function genresInUse(films: readonly Film[]): Genre[] {
  return [...new Set(films.map((film) => film.genre))].sort((a, b) => a.localeCompare(b, "tr"));
}
