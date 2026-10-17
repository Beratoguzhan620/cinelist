import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { API_URL } from "@/lib/config";
import type { Film, FilmInput } from "@/types/film";

export const filmsApi = createApi({
  reducerPath: "filmsApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ["Film"],
  endpoints: (build) => ({
    getFilms: build.query<Film[], void>({
      query: () => "/films",
      providesTags: [{ type: "Film", id: "LIST" }],
    }),
    getFilm: build.query<Film, string>({
      query: (id) => `/films/${id}`,
      providesTags: (_film, _error, id) => [{ type: "Film", id }],
    }),
    addFilm: build.mutation<Film, FilmInput>({
      query: (film) => ({
        url: "/films",
        method: "POST",
        body: { ...film, createdAt: new Date().toISOString() },
      }),
      async onQueryStarted(_film, { dispatch, queryFulfilled }) {
        try {
          const { data: created } = await queryFulfilled;
          dispatch(
            filmsApi.util.updateQueryData("getFilms", undefined, (films) => {
              films.push(created);
            }),
          );
          dispatch(filmsApi.util.upsertQueryData("getFilm", created.id, created));
        } catch {
          // The screen shows the error; the cache was never touched.
        }
      },
    }),
    updateFilm: build.mutation<Film, Pick<Film, "id"> & Partial<FilmInput>>({
      query: ({ id, ...changes }) => ({ url: `/films/${id}`, method: "PATCH", body: changes }),
      async onQueryStarted({ id, ...changes }, { dispatch, queryFulfilled }) {
        const patches = [
          dispatch(
            filmsApi.util.updateQueryData("getFilms", undefined, (films) => {
              const film = films.find((item) => item.id === id);
              if (film) Object.assign(film, changes);
            }),
          ),
          dispatch(
            filmsApi.util.updateQueryData("getFilm", id, (film) => {
              Object.assign(film, changes);
            }),
          ),
        ];
        try {
          await queryFulfilled;
        } catch {
          patches.forEach((patch) => patch.undo());
        }
      },
    }),
    deleteFilm: build.mutation<void, string>({
      query: (id) => ({ url: `/films/${id}`, method: "DELETE" }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          filmsApi.util.updateQueryData("getFilms", undefined, (films) => films.filter((film) => film.id !== id)),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
  }),
});

export const {
  useGetFilmsQuery,
  useGetFilmQuery,
  useAddFilmMutation,
  useUpdateFilmMutation,
  useDeleteFilmMutation,
} = filmsApi;
