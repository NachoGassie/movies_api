import { defaultGenreOrder } from "@constant";
import { GenreOrderByQuery } from "@model";
import { basicError, greaterThanError, stringLenghtError } from "@schemas/global";
import { QuerySchema } from "@schemas/global/global.schema";
import { z } from "zod";

export const genreSchema = z.object({
    idGenero: z
        .number(basicError("id_genero", "number"))
        .positive(greaterThanError("id_genero", 0)),
    genero: z
        .string(basicError("genero", "string"))
        .min(1, stringLenghtError("genero", 1)),
});

export const newGenreNameSchema = genreSchema.omit({ 
    idGenero: true 
});

export const genreQueriesSchema = QuerySchema.extend({
    order: z.nativeEnum(GenreOrderByQuery).default(defaultGenreOrder),
});