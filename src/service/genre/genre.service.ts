import { InternalError, NotFoundError } from "@httpResponse";
import { Genre, GenreQueries, GetAllGenreResp, NewGenre } from "@model";
import { genreQueriesSchema, newGenreNameSchema } from "@schemas";
import { dbFactory } from "@db";
import { parseToNumber } from "@utils";
import * as paginationUtil from "@utils/global/pagination.utils";

const genresDb = dbFactory.mySqlDb.genres;

export const getAllGenres = async (query: GenreQueries, baseUrl: string): Promise<GetAllGenreResp> => {
    const genreQueries: GenreQueries = parseGenreQuery(query);
    const totalCount: number = await genresDb.countAllGenres();

    const { pag, limit } = genreQueries;
    paginationUtil.isValidPagination(pag, limit, totalCount);

    const { next, prev } = paginationUtil.getPaginationUrlUtil(genreQueries, baseUrl, totalCount);

    const genres = await genresDb.getAllGenres(genreQueries) as Genre[];
    const maxPag = Math.ceil(totalCount / limit);

    return { genres, next, prev, pag, maxPag, totalCount }
}
export const getOneGenre = async (idGenero: number): Promise<Genre> => {
    const parsedId = parseToNumber(idGenero);

    const genre = await genresDb.getOneGenre(parsedId) as Genre;
    if (!genre) {
        throw new NotFoundError("genre with id "+ parsedId +" does not exist");
    }

    return genre;
} 
export const createOneGenre = async (newGenre: NewGenre): Promise<Genre> => {
    const { genero } = newGenreNameSchema.parse(newGenre);

    const idGenero = await genresDb.createOneGenre(genero);
    if (!idGenero) {
        throw new InternalError("it was not possible to create the genre");
    }
    return { idGenero, genero };
}
export const updateOneGenre = async (id: number, newGenre: NewGenre): Promise<Genre> => {
    const parsedId = await validateGenreId(id);
    const { genero } = newGenreNameSchema.parse(newGenre);

    const { affectedRows } = await genresDb.updateOneGenre(genero, parsedId);

    if (affectedRows !== 1) {
        throw new InternalError("genre with id " + parsedId + " could not be updated");
    }   

    return { idGenero: parsedId, genero }
}
export const deleteOneGenre = async (idGenero: number): Promise<number> => {
    const parsedId = await validateGenreId(idGenero);

    const affectedRows = await genresDb.deleteOneGenre(parsedId);
    if (affectedRows !== 1) {
        throw new InternalError("genre with id " + parsedId + " could not be deleted");
    }   

    return parsedId;
}

export const validateGenreId = async (id: number): Promise<number> => {
    const existsGenre = await genresDb.existsGenre(id);
    if (!existsGenre) {
        throw new NotFoundError("genre with id " + id + " does not exist");
    }

    return id;
}
const parseGenreQuery = (genreQueries: GenreQueries): GenreQueries => {
    if (genreQueries.pag) {
        genreQueries.pag = +genreQueries.pag;
    }
    if (genreQueries.limit) {
        genreQueries.limit = +genreQueries.limit;
    }

    return genreQueriesSchema.parse(genreQueries);
};