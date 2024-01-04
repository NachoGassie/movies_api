import { movieQueriesSchema, movieSchema, newMovieSchema, updateMovieSchema } from "../../schemas";
import { z } from "zod";
import { getAllResponse } from "../../model/global";


export type Movie = z.infer<typeof movieSchema>

export type NewMovie = z.infer<typeof newMovieSchema>
export type updateMovie = z.infer<typeof updateMovieSchema>

export interface GetAllMoviesResp extends getAllResponse{
    movies: Movie[];
}

export type MovieQueries = z.infer<typeof movieQueriesSchema>

