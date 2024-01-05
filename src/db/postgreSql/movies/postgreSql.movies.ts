import { Movie, MovieQueries, NewMovie, updateMovie } from "../../../model";
import { postgreSqlPool } from "../pool";

export const getAllMovies = async ({ pag, limit, order, sort } : MovieQueries): Promise<Movie[]> => {
    pag = (pag-1)*limit;

    const query = {
        text: 
        `SELECT * FROM PELICULAS p INNER JOIN GENEROS g ON p.id_genero = g.id_genero 
        ORDER BY ${order} ${sort} LIMIT $1 OFFSET $2`,
        values: [limit, pag],
    }

    return (await postgreSqlPool.query(query)).rows;
}
export const getAllMoviesByGenre = async ({ pag, limit, order, sort }: MovieQueries, idGenero: number): Promise<Movie[]> => {
    pag = (pag-1)*limit;

    const query = {
        text: 
        `SELECT * FROM PELICULAS p INNER JOIN GENEROS g ON p.id_genero = g.id_genero 
        WHERE p.id_genero = $1 ORDER BY ${order} ${sort} LIMIT $2 OFFSET $3`,
        values: [idGenero, limit, pag]
    }

    return (await postgreSqlPool.query(query)).rows; 
}
// FILTERED
export const getMovieById = async (id: number): Promise<Movie> => {
    const query = {
        text: 
        `SELECT * FROM PELICULAS p INNER JOIN GENEROS g 
        ON p.id_genero = g.id_genero WHERE id = $1`,
        values: [id]
    }

    return (await postgreSqlPool.query(query)).rows[0]; 
}
// CUD
export const createOneMovie = async (newMovie: NewMovie): Promise<number> => {
    const { titulo, anioLanzamiento, sinopsis, poster, idGenero } = newMovie;

    const query = {
        text: 
        `INSERT INTO PELICULAS(titulo, anio_lanzamiento, sinopsis, poster, id_genero) 
        values($1, $2, $3, $4, $5)
        RETURNING id`,
        values: [titulo, anioLanzamiento, sinopsis, poster, idGenero]
    }

    return (await postgreSqlPool.query(query)).rows[0].id; 
}
export const updateOneMovie = async (newMovie: updateMovie, id: number): Promise<number | null> => {
    const { titulo, anioLanzamiento, sinopsis, poster, idGenero } = newMovie;

    const query = {
        text: `
            UPDATE PELICULAS SET titulo = COALESCE($1, titulo), anio_lanzamiento = COALESCE($2, anio_lanzamiento),
            sinopsis = COALESCE($3, sinopsis), poster = COALESCE($4, poster), id_genero = COALESCE($5, id_genero)
            WHERE id = $6 RETURNING *
        `,
        values: [titulo, anioLanzamiento, sinopsis, poster, idGenero, id],
    };

    return (await postgreSqlPool.query(query)).rowCount; 
}
export const deleteOneMovie = async (id: number): Promise<number | null> => {
    const query = {
        text: "DELETE FROM PELICULAS WHERE id = $1",
        values: [id],
    };

    return (await postgreSqlPool.query(query)).rowCount; 
}
// QUANTITIE
export const moviesCount = async (): Promise<number> => {
    const query = "SELECT COUNT(*) as cant FROM PELICULAS";
    const resp = await postgreSqlPool.query(query)
    return +resp.rows[0].cant; 
}
export const moviesCountByGenre = async (id_genero: number): Promise<number> => {
    const query = {
        text: "SELECT COUNT(*) as cant FROM PELICULAS WHERE id_genero = $1",
        values: [id_genero]
    }

    const resp = await postgreSqlPool.query(query)
    return +resp.rows[0].cant; 
}
// EXISTS
export const existMovie = async (id: number): Promise<boolean> => {
    const query = {
        text: "SELECT 1 FROM PELICULAS WHERE id= $1",
        values: [id]
    }
    const resp = await postgreSqlPool.query(query);
    return !!resp.rows[0];
}