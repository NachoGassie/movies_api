import { defaultMovieOrder } from "../../constant";
import { existsGenre } from "../../db/mySql/genres/mySql.genres";
import { MovieOrderByQuery } from "../../model";
import { anioLanzamientoError, basicError, greaterThanError, stringLenghtError } from "../global";
import { QuerySchema } from "../global/global.schema";
import { z } from "zod";

const anioLanzamientoErr = "anioLanzamiento must be equal to or below the current year and above 1900";

export const movieSchema = z.object({
    id: z
        .number(basicError("id", "number"))
        .positive(greaterThanError("id", 0)),

    titulo: z
        .string(basicError("titulo", "string"))
        .min(2, stringLenghtError("titulo", 2)),

    sinopsis: z
        .string(basicError("sinopsis", "string"))
        .min(10, stringLenghtError("sinopsis", 10)),

    anioLanzamiento: z
        .number(anioLanzamientoError())
        .gt(1900, anioLanzamientoErr)
        .lte(new Date().getFullYear(), anioLanzamientoErr),
        
    poster: z
        .string(basicError("poster", "string"))
        .optional(),

    idGenero: z
        .number(basicError("idGenero", "number"))
        .positive(greaterThanError("idGenero", 0))
        .refine(async (id) => existsGenre(id), {
            message: `the idGenero you provided is not available`
        }),

    genero: z
        .string(basicError("genero", "string"))
        .min(2, stringLenghtError("genero", 2))
});

export const newMovieSchema = movieSchema.omit({ 
    id: true,
    genero: true 
});

export const updateMovieSchema = newMovieSchema.partial();

export const movieQueriesSchema = QuerySchema.extend({
    order: z.nativeEnum(MovieOrderByQuery).default(defaultMovieOrder),
});