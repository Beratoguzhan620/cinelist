import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

import seed from "../../server/db.seed.json";
import type { Film } from "@/types/film";

// A stand-in for json-server in demo mode: the same REST routes, answered from the browser.
// Films are kept in localStorage when it is available, otherwise in memory.

const KEY = "cinelist.demo.films";
let memory: Film[] | null = null;

function storage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function load(): Film[] {
  if (memory) return memory;
  try {
    const raw = storage()?.getItem(KEY);
    if (raw) return (memory = JSON.parse(raw) as Film[]);
  } catch {
    // Broken storage falls back to the seed data.
  }
  return (memory = structuredClone(seed.films) as Film[]);
}

function save(films: Film[]) {
  memory = films;
  try {
    storage()?.setItem(KEY, JSON.stringify(films));
  } catch {
    // Storage full or blocked: the films still live for this session.
  }
}

const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const notFound = { error: { status: 404, data: "Not Found" } as FetchBaseQueryError };

/** Puts the seed data back; used by tests. */
export function resetDemoData() {
  memory = null;
  storage()?.removeItem(KEY);
}

export const demoBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args) => {
  const { url, method = "GET", body } = typeof args === "string" ? { url: args, method: "GET", body: undefined } : args;
  const match = /^\/films(?:\/([^/?#]+))?\/?$/.exec(url);
  if (!match) return notFound;
  const id = match[1] ? decodeURIComponent(match[1]) : undefined;
  const films = load();
  const verb = method.toUpperCase();

  if (!id) {
    if (verb === "GET") return { data: films };
    if (verb === "POST") {
      const film = { ...(body as Omit<Film, "id">), id: newId() } as Film;
      save([...films, film]);
      return { data: film };
    }
    return { error: { status: 405, data: "Method Not Allowed" } };
  }

  const index = films.findIndex((film) => film.id === id);
  if (index < 0) return notFound;
  if (verb === "GET") return { data: films[index] };
  if (verb === "PATCH" || verb === "PUT") {
    const film = { ...(verb === "PATCH" ? films[index] : {}), ...(body as Partial<Film>), id } as Film;
    save(films.map((item, i) => (i === index ? film : item)));
    return { data: film };
  }
  if (verb === "DELETE") {
    save(films.filter((_, i) => i !== index));
    return { data: undefined };
  }
  return { error: { status: 405, data: "Method Not Allowed" } };
};
