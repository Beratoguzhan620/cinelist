import { describe, expect, it } from "vitest";

import { filterFilms, genresInUse, sortFilms } from "@/lib/films";

import { film } from "./fixtures";

const films = [
  film({ id: "1", title: "Kış Uykusu", year: 2014, rating: 8, genre: "Dram", createdAt: "2026-09-01T00:00:00Z" }),
  film({ id: "2", title: "Amélie", year: 2001, rating: 8.3, genre: "Komedi", createdAt: "2026-09-03T00:00:00Z" }),
  film({ id: "3", title: "Işıl Işıl", year: 2020, rating: 6.5, genre: "Komedi", createdAt: "2026-09-02T00:00:00Z" }),
  film({ id: "4", title: "Baba", year: 1972, rating: 8.3, genre: "Suç", createdAt: "2026-09-04T00:00:00Z" }),
];

describe("filterFilms", () => {
  it("matches titles case-insensitively with Turkish rules", () => {
    expect(filterFilms(films, { query: "KIŞ", genre: null }).map((f) => f.id)).toEqual(["1"]);
    expect(filterFilms(films, { query: "ışıl", genre: null }).map((f) => f.id)).toEqual(["3"]);
  });

  it("ignores accents", () => {
    expect(filterFilms(films, { query: "amelie", genre: null }).map((f) => f.id)).toEqual(["2"]);
  });

  it("combines search and genre", () => {
    expect(filterFilms(films, { query: "", genre: "Komedi" }).map((f) => f.id)).toEqual(["2", "3"]);
    expect(filterFilms(films, { query: "baba", genre: "Komedi" })).toEqual([]);
  });

  it("returns everything for an empty filter", () => {
    expect(filterFilms(films, { query: "  ", genre: null })).toHaveLength(4);
  });
});

describe("sortFilms", () => {
  it("sorts by newest first", () => {
    expect(sortFilms(films, "newest").map((f) => f.id)).toEqual(["4", "2", "3", "1"]);
  });

  it("sorts by rating and breaks ties by title", () => {
    expect(sortFilms(films, "rating").map((f) => f.id)).toEqual(["2", "4", "1", "3"]);
  });

  it("sorts by year descending", () => {
    expect(sortFilms(films, "year").map((f) => f.id)).toEqual(["3", "1", "2", "4"]);
  });

  it("sorts titles with the Turkish alphabet", () => {
    expect(sortFilms(films, "title").map((f) => f.title)).toEqual(["Amélie", "Baba", "Işıl Işıl", "Kış Uykusu"]);
  });

  it("does not mutate the input", () => {
    const copy = [...films];
    sortFilms(films, "rating");
    expect(films).toEqual(copy);
  });
});

describe("genresInUse", () => {
  it("lists each genre once in alphabetical order", () => {
    expect(genresInUse(films)).toEqual(["Dram", "Komedi", "Suç"]);
  });
});
