import { GENRES, type Film, type FilmInput, type Genre } from "@/types/film";

export type FilmFormValues = {
  title: string;
  year: string;
  durationMinutes: string;
  genre: Genre | "";
  rating: string;
  description: string;
  posterUrl: string;
};

export type FilmFormField = keyof FilmFormValues;
export type FilmFormErrors = Partial<Record<FilmFormField, string>>;

export const MIN_YEAR = 1888;

export const emptyFilmForm: FilmFormValues = {
  title: "",
  year: "",
  durationMinutes: "",
  genre: "",
  rating: "",
  description: "",
  posterUrl: "",
};

export function filmToForm(film: Film): FilmFormValues {
  return {
    title: film.title,
    year: String(film.year),
    durationMinutes: String(film.durationMinutes),
    genre: film.genre,
    rating: film.rating.toFixed(1).replace(".", ","),
    description: film.description,
    posterUrl: film.posterUrl ?? "",
  };
}

function parseInteger(value: string): number | null {
  const trimmed = value.trim();
  return /^\d+$/.test(trimmed) ? Number(trimmed) : null;
}

function parseRating(value: string): number | null {
  const trimmed = value.trim().replace(",", ".");
  return /^\d{1,2}(\.\d)?$/.test(trimmed) ? Number(trimmed) : null;
}

export function validateField(field: FilmFormField, values: FilmFormValues, now = new Date()): string | undefined {
  const maxYear = now.getFullYear() + 2;
  switch (field) {
    case "title": {
      const title = values.title.trim();
      if (title === "") return "Film adı zorunlu.";
      if (title.length > 120) return "Film adı en fazla 120 karakter olabilir.";
      return undefined;
    }
    case "year": {
      const year = parseInteger(values.year);
      if (year === null || year < MIN_YEAR || year > maxYear) return `Yıl ${MIN_YEAR} ile ${maxYear} arasında olmalı.`;
      return undefined;
    }
    case "durationMinutes": {
      const minutes = parseInteger(values.durationMinutes);
      if (minutes === null || minutes < 1 || minutes > 600) return "Süre 1 ile 600 dakika arasında olmalı.";
      return undefined;
    }
    case "genre":
      return values.genre !== "" && (GENRES as readonly string[]).includes(values.genre) ? undefined : "Bir tür seç.";
    case "rating": {
      const rating = parseRating(values.rating);
      if (rating === null || rating < 0 || rating > 10) return "Puan 0 ile 10 arasında, en fazla bir ondalık olmalı (ör. 7,5).";
      return undefined;
    }
    case "description": {
      const description = values.description.trim();
      if (description.length < 10) return "Açıklama en az 10 karakter olmalı.";
      if (description.length > 1000) return "Açıklama en fazla 1000 karakter olabilir.";
      return undefined;
    }
    case "posterUrl": {
      const url = values.posterUrl.trim();
      if (url === "" || /^(https?:\/\/|\/)\S+$/i.test(url)) return undefined;
      return "Geçerli bir http(s) adresi gir ya da boş bırak.";
    }
  }
}

const FIELDS: FilmFormField[] = ["title", "year", "durationMinutes", "genre", "rating", "description", "posterUrl"];

export type ValidationResult = { ok: true; value: FilmInput } | { ok: false; errors: FilmFormErrors };

export function validateFilm(values: FilmFormValues, now = new Date()): ValidationResult {
  const errors: FilmFormErrors = {};
  for (const field of FIELDS) {
    const message = validateField(field, values, now);
    if (message) errors[field] = message;
  }
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const posterUrl = values.posterUrl.trim();
  return {
    ok: true,
    value: {
      title: values.title.trim(),
      year: Number(values.year.trim()),
      durationMinutes: Number(values.durationMinutes.trim()),
      genre: values.genre as Genre,
      rating: Number(values.rating.trim().replace(",", ".")),
      description: values.description.trim(),
      posterUrl: posterUrl === "" ? null : posterUrl,
    },
  };
}
