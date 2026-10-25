import { configureStore } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query";
import { beforeEach, describe, expect, it } from "vitest";

import { demoBaseQuery, resetDemoData } from "@/store/demoBaseQuery";
import type { Film } from "@/types/film";

import seed from "../server/db.seed.json";

const call = (url: string, method = "GET", body?: unknown) =>
  demoBaseQuery({ url, method, body }, {} as never, {}) as Promise<{ data?: unknown; error?: { status: number } }>;

beforeEach(() => resetDemoData());

describe("demo base query", () => {
  it("starts from the seed films", async () => {
    const { data } = await call("/films");
    expect((data as Film[]).map((film) => film.id)).toEqual(seed.films.map((film) => film.id));
  });

  it("adds, reads, updates and deletes a film", async () => {
    const created = (await call("/films", "POST", { ...seed.films[0], id: undefined, title: "Yeni film" })).data as Film;
    expect(created.id).toBeTruthy();
    expect(((await call(`/films/${created.id}`)).data as Film).title).toBe("Yeni film");

    const updated = (await call(`/films/${created.id}`, "PATCH", { rating: 7.5 })).data as Film;
    expect(updated).toMatchObject({ id: created.id, title: "Yeni film", rating: 7.5 });

    await call(`/films/${created.id}`, "DELETE");
    expect((await call(`/films/${created.id}`)).error?.status).toBe(404);
    expect(((await call("/films")).data as Film[]).length).toBe(seed.films.length);
  });

  it("answers unknown routes and films with 404", async () => {
    expect((await call("/actors")).error?.status).toBe(404);
    expect((await call("/films/nope", "PATCH", {})).error?.status).toBe(404);
  });

  it("works behind RTK Query like the real server", async () => {
    const api = createApi({
      baseQuery: demoBaseQuery,
      endpoints: (build) => ({ films: build.query<Film[], void>({ query: () => "/films" }) }),
    });
    const store = configureStore({
      reducer: { [api.reducerPath]: api.reducer },
      middleware: (getDefault) => getDefault().concat(api.middleware),
    });
    const result = await store.dispatch(api.endpoints.films.initiate());
    expect(result.data).toHaveLength(seed.films.length);
  });
});
