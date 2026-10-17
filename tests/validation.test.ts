import { describe, expect, it } from "vitest";

import { formatDuration, formatRating } from "@/lib/format";
import { emptyFilmForm, filmToForm, validateField, validateFilm, type FilmFormValues } from "@/lib/validation";

import { film } from "./fixtures";

const now = new Date("2026-10-17T12:00:00Z");

const valid: FilmFormValues = {
  title: "  Yıldızlararası ",
  year: "2014",
  durationMinutes: "169",
  genre: "Bilim kurgu",
  rating: "8,7",
  description: "Kuraklığın tükettiği Dünya'dan yeni bir yuva arayışı.",
  posterUrl: "",
};

describe("validateFilm", () => {
  it("returns a clean film for valid input", () => {
    const result = validateFilm(valid, now);
    expect(result).toEqual({
      ok: true,
      value: {
        title: "Yıldızlararası",
        year: 2014,
        durationMinutes: 169,
        genre: "Bilim kurgu",
        rating: 8.7,
        description: "Kuraklığın tükettiği Dünya'dan yeni bir yuva arayışı.",
        posterUrl: null,
      },
    });
  });

  it("reports every missing field on an empty form", () => {
    const result = validateFilm(emptyFilmForm, now);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.errors).sort()).toEqual(
        ["description", "durationMinutes", "genre", "rating", "title", "year"].sort(),
      );
    }
  });

  it("keeps the poster url optional but checks its format", () => {
    expect(validateField("posterUrl", { ...valid, posterUrl: "" }, now)).toBeUndefined();
    expect(validateField("posterUrl", { ...valid, posterUrl: "https://example.com/a.jpg" }, now)).toBeUndefined();
    expect(validateField("posterUrl", { ...valid, posterUrl: "/posters/baba.jpg" }, now)).toBeUndefined();
    expect(validateField("posterUrl", { ...valid, posterUrl: "afis.jpg" }, now)).toBeDefined();
  });
});

describe("validateField", () => {
  it.each([
    ["1887", false],
    ["1888", true],
    ["2028", true],
    ["2029", false],
    ["20a4", false],
  ])("year %s valid=%s", (year, ok) => {
    expect(validateField("year", { ...valid, year }, now) === undefined).toBe(ok);
  });

  it.each([
    ["0", true],
    ["10", true],
    ["7.5", true],
    ["7,5", true],
    ["10,5", false],
    ["7,55", false],
    ["-1", false],
    ["", false],
  ])("rating %s valid=%s", (rating, ok) => {
    expect(validateField("rating", { ...valid, rating }, now) === undefined).toBe(ok);
  });

  it.each([
    ["0", false],
    ["1", true],
    ["600", true],
    ["601", false],
  ])("duration %s valid=%s", (durationMinutes, ok) => {
    expect(validateField("durationMinutes", { ...valid, durationMinutes }, now) === undefined).toBe(ok);
  });

  it("requires a description of at least 10 characters", () => {
    expect(validateField("description", { ...valid, description: "  kısa   " }, now)).toBeDefined();
  });

  it("rejects an unknown genre", () => {
    expect(validateField("genre", { ...valid, genre: "Western" as never }, now)).toBeDefined();
  });
});

describe("filmToForm", () => {
  it("round-trips through validation", () => {
    const source = film({ id: "9", title: "Baba", year: 1972, rating: 9.2, genre: "Suç", posterUrl: "/posters/baba.jpg" });
    const result = validateFilm(filmToForm(source), now);
    expect(result.ok && result.value).toEqual({
      title: "Baba",
      year: 1972,
      durationMinutes: 120,
      genre: "Suç",
      rating: 9.2,
      description: source.description,
      posterUrl: "/posters/baba.jpg",
    });
  });
});

describe("format", () => {
  it("formats ratings with a Turkish decimal comma", () => {
    expect(formatRating(9)).toBe("9,0");
    expect(formatRating(8.75)).toBe("8,8");
  });

  it("formats durations in hours and minutes", () => {
    expect(formatDuration(45)).toBe("45 dk");
    expect(formatDuration(120)).toBe("2 sa");
    expect(formatDuration(169)).toBe("2 sa 49 dk");
  });
});
