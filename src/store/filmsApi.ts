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
      providesTags: (films) =>
        films
          ? [...films.map(({ id }) => ({ type: "Film" as const, id })), { type: "Film", id: "LIST" }]
          : [{ type: "Film", id: "LIST" }],
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
      invalidatesTags: [{ type: "Film", id: "LIST" }],
    }),
    updateFilm: build.mutation<Film, Pick<Film, "id"> & Partial<FilmInput>>({
      query: ({ id, ...changes }) => ({ url: `/films/${id}`, method: "PATCH", body: changes }),
      invalidatesTags: (_film, _error, { id }) => [{ type: "Film", id }],
    }),
    deleteFilm: build.mutation<void, string>({
      query: (id) => ({ url: `/films/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Film", id },
        { type: "Film", id: "LIST" },
      ],
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
