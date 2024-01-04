import { Request, Response } from "express";
import fs from "fs";
import { join } from "path";
import { NotFoundError, ResponseCreated, ResponseHandler, ResponseOk } from "../../httpResponse";
import { GetAllMoviesResp, HTTPSTATUS, Movie, MovieQueries } from "../../model";
import * as movieService from "../../service/movie";
import { parseToNumber } from "../../utils";

export const getAllMovies = async (req: Request, res: Response) => {
    const query = req.query as unknown as MovieQueries;
    const { baseUrl } = req;

    const data = await movieService.getAllMovies(query, baseUrl);
    
    return getAllMoviesResponse(res, data);
}
export const getAllMoviesByGenre = async (req: Request, res: Response) => {
    const query = req.query as unknown as MovieQueries;
    const { baseUrl } = req;

    const idGenero = parseToNumber(req.params.genreId);
    const data = await movieService.getAllMoviesByGenre(query, baseUrl, idGenero);

    return getAllMoviesResponse(res, data);
}
export const getMovieById = async (req: Request, res: Response) => {
    const movieId = parseToNumber(req.params.movieId);

    const movie: Movie = await movieService.getMovieById(movieId);
    return ResponseHandler(res, new ResponseOk(
        movie 
    ));
}
export const createOneMovie = async (req: Request, res: Response) => {    
    const { body } = req;
    const poster = req.file?.filename;
    const newMovie = { 
        ...body,
        poster
    }

    const movie: Movie = await movieService.createMovie(newMovie);
    return ResponseHandler(res, new ResponseCreated(
        movie
    ));
}

export const updateOneMovie = async (req: Request, res: Response) => {
    const movieId = parseToNumber(req.params.movieId);
    const { body } = req;

    let newMovie = body;
    const poster = req.file?.filename;

    if (poster) {
        newMovie = { 
            ...newMovie,
            poster
        }
    }

    const movie: Movie = await movieService.updateOneMovie(movieId, newMovie);
    return ResponseHandler(res, new ResponseOk(
        movie
    ));
}
export const deleteOneMovie = async (req: Request, res: Response) => {
    const movieId = parseToNumber(req.params.movieId);

    const id: number = await movieService.deleteOneMovie(movieId);
    return ResponseHandler(res, new ResponseOk({
        id
    }));
}
export const getPoster = (req: Request, res: Response) => {
    const posterUrl = movieService.validatePosterUrl(req.url);
    const imagePath = join(__dirname, "../../public/posters", posterUrl);

    if (!fs.existsSync(imagePath)) {
        throw new NotFoundError("Poster not found");
    }
    
    return res.status(HTTPSTATUS.OK).sendFile(imagePath);
}


const getAllMoviesResponse = (res: Response, data: GetAllMoviesResp) => {
    const { 
        movies, next, prev, pag, maxPag, totalCount 
    } = data;

    return ResponseHandler(res, new ResponseOk({
        totalCount, 
        pagesCount: pag+"/"+maxPag,
        next,
        prev,
        movies
    }));
}