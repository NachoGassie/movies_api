import { mySqlPool as pool} from "../";
import { Movie, MovieQueries, NewMovie, updateMovie } from "../../../model";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// GET ALL
export const getAllMovies = async ({ pag, limit, order, sort } : MovieQueries): Promise<Movie[]> => {
    pag = (pag-1)*limit;

    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM PELICULAS p INNER JOIN GENEROS g ON p.id_genero = g.id_genero 
        ORDER BY ${order} ${sort} LIMIT ?, ?`, [pag, limit]
    ); 
    return rows as Movie[];
}
export const getAllMoviesByGenre = async (movieQueries: MovieQueries, idGenero: number): Promise<Movie[]> => {
    let { pag, limit, order, sort } = movieQueries;
    pag = (pag-1)*limit;

    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM PELICULAS p INNER JOIN GENEROS g ON p.id_genero = g.id_genero 
        WHERE p.id_genero = ? ORDER BY ${order} ${sort} LIMIT ?, ?`, [idGenero, pag, limit]
    ); 
    return rows as Movie[];
}
// FILTERED
export const getMovieById = async (id: number): Promise<Movie> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM PELICULAS p INNER JOIN GENEROS g 
        ON p.id_genero = g.id_genero WHERE id= ?`, [id]
    );
    return rows[0] as Movie;
}
// CUD
export const createOneMovie = async (newMovie: NewMovie): Promise<number> => {
    const { titulo, anioLanzamiento, sinopsis, poster, idGenero } = newMovie;
    const rows = await pool.query<ResultSetHeader>(
        `INSERT INTO PELICULAS(titulo, anio_lanzamiento, sinopsis, poster, id_genero) 
        values(?, ?, ?, ?, ?)`, [titulo, anioLanzamiento, sinopsis, poster, idGenero]
    );
    return rows[0].insertId;
}
export const updateOneMovie = async (newMovie: updateMovie, id: number): Promise<number> => {
    const { titulo, anioLanzamiento, sinopsis, poster, idGenero } = newMovie;

    const rows = await pool.query<ResultSetHeader>(
        `UPDATE PELICULAS SET titulo = IFNULL(?, titulo), anio_lanzamiento = IFNULL(?, anio_lanzamiento), 
        sinopsis = IFNULL(?, sinopsis), poster = IFNULL(?, poster), id_genero = IFNULL(?, id_genero)  WHERE id = ?`, 
        [titulo, anioLanzamiento, sinopsis, poster, idGenero, id]
    );
    return rows[0].affectedRows;
}
export const deleteOneMovie = async (id: number): Promise<number> => {
    const rows = await pool.query<ResultSetHeader>(
        "DELETE FROM PELICULAS WHERE id = ?", [id]
    );
    return rows[0].affectedRows;
}
// QUANTITIE
export const moviesCount = async (): Promise<number> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT COUNT(*) as cant FROM PELICULAS "
    );
    return +rows[0].cant;
}
export const moviesCountByGenre = async (id_genero: number): Promise<number> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT COUNT(*) as cant FROM PELICULAS WHERE id_genero = ?", 
        [id_genero]
    );
    return +rows[0].cant;
}
// EXISTS
export const existMovie = async (id: number): Promise<boolean> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT 1 FROM PELICULAS WHERE id= ?", [id]
    );
    return !!rows[0];
}
export const existMovieByGenre = async (idGenero: number): Promise<boolean> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT 1 FROM PELICULAS p INNER JOIN GENEROS g ON p.id_genero = g.id_genero 
        WHERE g.id_genero = ?`, [idGenero]
    );
    return !!rows[0];
}