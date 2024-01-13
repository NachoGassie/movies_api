import { extensionAllowed } from "../../constant";
import { dbFactory } from "../../db";
import { BadRequestError, InternalError, NotFoundError } from "../../httpResponse";
import { GetAllMoviesResp, Movie, MovieQueries, NewMovie, updateMovie } from "../../model";
import { movieQueriesSchema, newMovieSchema, updateMovieSchema } from "../../schemas";
import { validateGenreId } from "../genre";
import * as paginationUtil from "../../utils/global/pagination.utils";

// MySql moviesDb : dbFactory.mySqlDb.movies;
// Pg moviesDb : dbFactory.pgDb.movies;

const moviesDb = dbFactory.pgDb.movies;

export const getAllMovies = async (
    query: MovieQueries, baseUrl: string
): Promise<GetAllMoviesResp> => {

    const movieQueries: MovieQueries = parseMovieQueries(query);
    const totalCount: number = await moviesDb.moviesCount();

    const { next, prev, maxPag } = getAllMoviesHelper(movieQueries, totalCount, baseUrl);
    const movies = await moviesDb.getAllMovies(movieQueries);
    const { pag } = movieQueries;

    return { movies, next, prev, pag, maxPag, totalCount }
}

export const getAllMoviesByGenre = async (
    query: MovieQueries, baseUrl: string, idGenero: number
): Promise<GetAllMoviesResp> => {

    const movieQueries: MovieQueries = parseMovieQueries(query);    
    const parsedIdGenero = await validateGenreId(idGenero);
    const totalCount: number = await moviesDb.moviesCountByGenre(parsedIdGenero);
    const { next, prev, maxPag } = getAllMoviesHelper(movieQueries, totalCount, baseUrl);

    const movies = await moviesDb.getAllMoviesByGenre(movieQueries, idGenero); 
    const { pag } = movieQueries;

    return { movies, next, prev, pag, maxPag, totalCount }
}
export const getMovieById = async (movieId: number): Promise<Movie> => {
    const movie = await moviesDb.getMovieById(movieId) as Movie;
    if (!movie) {
        throw new NotFoundError("movie with id " + movieId +" does not exist");
    }

    return movie;
}
export const createMovie = async (movie: NewMovie): Promise<Movie> => {
    const newMovie = await parseNewMovie(movie);

    const insertId = await moviesDb.createOneMovie(newMovie);
    if (!insertId) {
        throw new InternalError("it was not possible to create the movie");
    }

    return moviesDb.getMovieById(insertId);
}
export const updateOneMovie = async (id: number, movie: updateMovie): Promise<Movie> => {

    if (Object.keys(movie).length <= 0) {
        throw new BadRequestError("at least one field is expected");
    }

    const movieId = await validateMovieId(id);
    const newMovie = await parseUpdateMovie(movie);
    
    const affectedRows  = await moviesDb.updateOneMovie(newMovie, movieId);
    if (affectedRows !== 1) {
        throw new InternalError("movie with id " + movieId + " could not be updated");
    }   

    return moviesDb.getMovieById(movieId);
}
export const deleteOneMovie = async (id: number) => {
    const movieId = await validateMovieId(id);

    const affectedRows = await moviesDb.deleteOneMovie(movieId);
    if (affectedRows !== 1) {
        throw new InternalError("movie with id " + movieId + " could not be deleted");
    }   

    return movieId;
}
export const validatePosterUrl = (posterUrl: string): string => {
    const dotSplit = posterUrl.split(".")
    const type = dotSplit[1];

    if (!type || !extensionAllowed.includes(type)) {4
        throw new BadRequestError(
            "poster name must must have one the following extensions " + extensionAllowed.join(" - ")
        );
    }

    const underscoreSplit = dotSplit[0].split("_");

    if (underscoreSplit.length < 2) {
        throw new BadRequestError("poster name must must be in the 'name_id.ext' format");
    }

    return posterUrl;
}


const validateMovieId = async (id: number): Promise<number> => {
    const existMovie2 = await moviesDb.existMovie(id);
    if (!existMovie2) {
        throw new NotFoundError("movie with id " + id + " does not exist");
    }

    return id;
}
const parseNewMovie = async (movie: NewMovie): Promise<NewMovie> => {
    movie.idGenero = +movie.idGenero;
    movie.anioLanzamiento = +movie.anioLanzamiento;
    return await newMovieSchema.parseAsync(movie);
}
const parseUpdateMovie = async (movie: updateMovie): Promise<updateMovie> => {
    if (movie.idGenero) 
        movie.idGenero = +movie.idGenero;

    if (movie.anioLanzamiento) 
        movie.anioLanzamiento = +movie.anioLanzamiento;
    
    return await updateMovieSchema.parseAsync(movie);
}
const parseMovieQueries = (movieQueries: MovieQueries): MovieQueries => {
    if (movieQueries.pag) {
        movieQueries.pag = +movieQueries.pag;
    }
    if (movieQueries.limit) {
        movieQueries.limit = +movieQueries.limit;
    }

    return movieQueriesSchema.parse(movieQueries);
};
const getAllMoviesHelper = (movieQueries: MovieQueries, totalCount: number, baseUrl: string) => {

    if (totalCount <= 0) {
        throw new NotFoundError("no movies were found");
    }

    const { pag, limit } = movieQueries;

    paginationUtil.isValidPagination(pag, limit, totalCount);

    const { next, prev } = paginationUtil.getPaginationUrlUtil(movieQueries, baseUrl, totalCount);
    const maxPag = Math.ceil(totalCount / limit);

    return { next, prev, maxPag }
}