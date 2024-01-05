import { movieQueriesSchema, movieSchema, newMovieSchema, updateMovieSchema } from "../../schemas";
import { z } from "zod";
import { GetAllResponse } from "../../model/global";


export type Movie = z.infer<typeof movieSchema>

export type NewMovie = z.infer<typeof newMovieSchema>
export type updateMovie = z.infer<typeof updateMovieSchema>

export interface GetAllMoviesResp extends GetAllResponse{
    movies: Movie[];
}

export type MovieQueries = z.infer<typeof movieQueriesSchema>

