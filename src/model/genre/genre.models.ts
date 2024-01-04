import { genreQueriesSchema, genreSchema, newGenreNameSchema } from "../../schemas";
import { z } from "zod"
import { getAllResponse } from "../../model/global";

export type GenreQueries = z.infer<typeof genreQueriesSchema>

export type Genre = z.infer<typeof genreSchema> 
export type GenreId = Omit<Genre, "genero">;
export type NewGenre = z.infer<typeof newGenreNameSchema>

export interface GetAllGenreResp extends getAllResponse{
    genres: Genre[];
}