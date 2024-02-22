import { Genre, GenreQueries } from "../../../model";
import { postgreSqlPool } from "../pool";

export const getAllGenresNoPag = async ({ order, sort }: GenreQueries): Promise<Genre[]> => {
    const query = `SELECT * FROM generos g ORDER BY ${order} ${sort}`;
    return (await postgreSqlPool.query(query)).rows;
}
export const getAllGenres = async ({ pag, limit, order, sort }: GenreQueries): Promise<Genre[]> => {
    pag = (pag-1)*limit;
    const query = {
        text: `SELECT * FROM generos g ORDER BY ${order} ${sort} LIMIT $1 OFFSET $2`,
        values: [limit, pag],
    }
    return (await postgreSqlPool.query(query)).rows;
}
// FILTERED
export const getOneGenre = async (idGenero: number): Promise<Genre> => {
    const query = {
        text: "SELECT * FROM generos WHERE id_genero = $1",
        values: [idGenero]
    }

    return (await postgreSqlPool.query(query)).rows[0]; 
}
// CUD
export const createOneGenre = async(newGenre: string): Promise<number> => {
    const query = {
        text: 
        "INSERT INTO GENEROS (genero) values($1) RETURNING id_genero",
        values: [newGenre]
    }

    return (await postgreSqlPool.query(query)).rows[0].id_genero; 
}
export const updateOneGenre = async (newGenre: string, id: number): Promise<number | null> => {
    const query = {
        text: "UPDATE GENEROS SET genero = $1 WHERE id_genero = $2",
        values: [newGenre, id],
    };

    return (await postgreSqlPool.query(query)).rowCount; 
}
export const deleteOneGenre = async(idGenero: number): Promise<number | null> => {
    const query = {
        text: "DELETE FROM generos WHERE id_genero = $1",
        values: [idGenero],
    };

    return (await postgreSqlPool.query(query)).rowCount; 
}
// QUANTITIE
export const countAllGenres = async (): Promise<number> => {
    const query = "SELECT COUNT(*) as cant FROM generos";
    const resp = await postgreSqlPool.query(query)
    return +resp.rows[0].cant; 
}
// EXISTS
export const existsGenre = async (idGenero: number): Promise<boolean> => {
    const query = {
        text: "SELECT 1 FROM generos WHERE id_genero = $1",
        values: [idGenero]
    }
    const resp = await postgreSqlPool.query(query);
    return !!resp.rows[0];
} 