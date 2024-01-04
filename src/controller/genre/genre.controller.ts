import { ResponseCreated, ResponseHandler, ResponseOk } from "../../httpResponse";
import { Genre, GenreQueries } from "../../model";
import * as genreService from "../../service/genre";
import { parseToNumber } from "../../utils";
import { Request, Response } from "express";

export const getAllGenres = async (req: Request, res: Response) => {
    const query = req.query as unknown as GenreQueries;
    const { baseUrl } = req;
    const { 
        genres,  next, prev, pag, maxPag, totalCount
    } = await genreService.getAllGenres(query, baseUrl);

    return ResponseHandler(res, new ResponseOk({
        totalCount,
        pagesCount: pag+"/"+maxPag,
        next,
        prev,
        genres
    }));
}
export const getOneGenre = async (req: Request, res: Response) => {
    const genreId = parseToNumber(req.params.genreId);
    const genre: Genre = await genreService.getOneGenre(genreId);
    return ResponseHandler(res, new ResponseOk(
        genre
    ));
}
export const createOneGenre = async (req: Request, res: Response) => {
    const { body } = req;
    const genre: Genre = await genreService.createOneGenre(body);
    return ResponseHandler(res, new ResponseCreated(
        genre
    ));
}
export const updateOneGenre = async (req: Request, res: Response) => {
    const genreId = parseToNumber(req.params.genreId);
    const { body } = req;

    const genre: Genre = await genreService.updateOneGenre(genreId, body);
    return ResponseHandler(res, new ResponseOk(
        genre
    ));
}
export const deleteOneGenre = async (req: Request, res: Response) => {
    const genreId = parseToNumber(req.params.genreId);

    const id_genero: number = await genreService.deleteOneGenre(genreId);
    return ResponseHandler(res, new ResponseOk({
        id_genero
    }));
}