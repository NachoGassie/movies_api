import { BadRequestError, InternalError, NotFoundError } from "../../httpResponse";
import { Genre, GenreQueries, GetAllGenreResp, NewGenre } from "../../model";
import { genreQueriesSchema, newGenreNameSchema } from "../../schemas";
import { dbFactory } from "../../db";
import { parseToNumber } from "../../utils";
import * as paginationUtil from "../../utils/global/pagination.utils";

// MySql genresDb : dbFactory.mySqlDb.genres;
// Pg genresDb : dbFactory.pgDb.genres;

// MySql moviesDb : dbFactory.mySqlDb.movies;
// Pg moviesDb : dbFactory.pgDb.movies;

const genresDb = dbFactory.pgDb.genres;
const moviesDb = dbFactory.pgDb.movies;

export const getAllGenres = async (query: GenreQueries, baseUrl: string): Promise<GetAllGenreResp> => {
    const genreQueries: GenreQueries = parseGenreQuery(query);
    const totalCount: number = await genresDb.countAllGenres();

    const { pag } = genreQueries;
    const limit = totalCount;
    const getAllQueries = { ...genreQueries, limit }
    paginationUtil.isValidPagination(pag, limit, totalCount);

    const { next, prev } = paginationUtil.getPaginationUrlUtil(getAllQueries, baseUrl, totalCount);

    const genres = await genresDb.getAllGenresNoPag(genreQueries) as Genre[];
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
    const insertId = await genresDb.createOneGenre(genero);

    if (!insertId) {
        throw new InternalError("it was not possible to create the genre");
    }

    return genresDb.getOneGenre(insertId);
}
export const updateOneGenre = async (id: number, newGenre: NewGenre): Promise<Genre> => {
    const parsedId = await validateGenreId(id);
    const { genero } = newGenreNameSchema.parse(newGenre);

    const affectedRows = await genresDb.updateOneGenre(genero, parsedId);
    if (affectedRows !== 1) {
        throw new InternalError("genre with id " + parsedId + " could not be updated");
    }   

    return genresDb.getOneGenre(parsedId);
}
export const deleteOneGenre = async (idGenero: number): Promise<number> => {
    const parsedId = await validateGenreId(idGenero);
    const moviesWithId = await moviesDb.existMovieByGenre(parsedId);

    if (moviesWithId) {
        throw new BadRequestError("genre with id "+ parsedId + " belongs to a film therefor it can not be deleted");
    }  

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