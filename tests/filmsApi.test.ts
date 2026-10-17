import { configureStore } from "@reduxjs/toolkit";
import { afterEach, describe, expect, it, vi } from "vitest";

import { filmsApi } from "@/store/filmsApi";
import type { Film } from "@/types/film";

import { film } from "./fixtures";

type Handler = (request: Request) => Promise<Response> | Response;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

function setup(handler: Handler) {
  vi.stubGlobal("fetch", vi.fn((input: RequestInfo | URL, init?: RequestInit) => handler(new Request(input, init))));
  const store = configureStore({
    reducer: { [filmsApi.reducerPath]: filmsApi.reducer },
    middleware: (getDefault) => getDefault().concat(filmsApi.middleware),
  });
  const cached = () => filmsApi.endpoints.getFilms.select()(store.getState()).data;
  return { store, cached };
}

const seed: Film[] = [film({ id: "1", title: "Baba" }), film({ id: "2", title: "Eşkıya" })];

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("filmsApi optimistic updates", () => {
  it("removes a film from the list before the server answers", async () => {
    let release: (response: Response) => void = () => {};
    const { store, cached } = setup((request) =>
      request.method === "DELETE" ? new Promise<Response>((resolve) => (release = resolve)) : json(seed),
    );
    await store.dispatch(filmsApi.endpoints.getFilms.initiate());

    const pending = store.dispatch(filmsApi.endpoints.deleteFilm.initiate("1"));
    await vi.waitFor(() => expect(cached()?.map((f) => f.id)).toEqual(["2"]));

    release(json({}));
    await pending;
    expect(cached()?.map((f) => f.id)).toEqual(["2"]);
  });

  it("puts the film back when the delete fails", async () => {
    const { store, cached } = setup((request) => (request.method === "DELETE" ? json({}, 500) : json(seed)));
    await store.dispatch(filmsApi.endpoints.getFilms.initiate());

    const result = await store.dispatch(filmsApi.endpoints.deleteFilm.initiate("1"));
    expect("error" in result).toBe(true);
    expect(cached()?.map((f) => f.id)).toEqual(["1", "2"]);
  });

  it("applies edits immediately and rolls back on failure", async () => {
    let release: (response: Response) => void = () => {};
    const { store, cached } = setup((request) =>
      request.method === "PATCH" ? new Promise<Response>((resolve) => (release = resolve)) : json(seed),
    );
    await store.dispatch(filmsApi.endpoints.getFilms.initiate());

    const pending = store.dispatch(filmsApi.endpoints.updateFilm.initiate({ id: "2", rating: 9.5 }));
    await vi.waitFor(() => expect(cached()?.find((f) => f.id === "2")?.rating).toBe(9.5));

    release(json({ message: "boom" }, 500));
    await pending;
    expect(cached()?.find((f) => f.id === "2")?.rating).toBe(7);
  });

  it("appends a created film to the cached list", async () => {
    const { store, cached } = setup(async (request) => {
      if (request.method === "POST") {
        const body = (await request.json()) as Omit<Film, "id">;
        return json({ ...body, id: "abcd" }, 201);
      }
      return json(seed);
    });
    await store.dispatch(filmsApi.endpoints.getFilms.initiate());

    const { title, year, durationMinutes, genre, rating, description, posterUrl } = film({ id: "x", title: "Whiplash" });
    await store.dispatch(
      filmsApi.endpoints.addFilm.initiate({ title, year, durationMinutes, genre, rating, description, posterUrl }),
    );

    expect(cached()?.map((f) => f.title)).toEqual(["Baba", "Eşkıya", "Whiplash"]);
    expect(cached()?.at(-1)?.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});
