import { mySqlPool as pool} from "../";
import { Genre, GenreQueries } from "../../../model";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export const getAllGenresNoPag = async ({ order, sort }: GenreQueries): Promise<Genre[]> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM generos ORDER BY ${order} ${sort}`
    );
    return rows as Genre[];
}
export const getAllGenres = async ({ pag, limit, order, sort }: GenreQueries): Promise<Genre[]> => {
    pag = (pag-1)*limit;

    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM generos ORDER BY ${order} ${sort} LIMIT ?, ?`, [pag, limit]
    );
    return rows as Genre[];
}
// FILTERED
export const getOneGenre = async (idGenero: number): Promise<Genre> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM generos WHERE id_genero = ?", [idGenero]
    );
    return rows[0] as Genre;
}
// CUD
export const createOneGenre = async(newGenre: string): Promise<number> => {
    const rows = await pool.query<ResultSetHeader>(
        "INSERT INTO GENEROS (genero) values(?)", [newGenre]
    );
    return rows[0].insertId;
}
export const updateOneGenre = async (newGenre: string, id: number): Promise<number> => {
    const rows = await pool.query<ResultSetHeader>(
        "UPDATE GENEROS SET genero = ? WHERE id_genero = ?", [newGenre, id]
    );
    return rows[0].affectedRows;
}
export const deleteOneGenre = async(idGenero: number): Promise<number> => {
    const rows = await pool.query<ResultSetHeader>(
        "DELETE FROM generos WHERE id_genero = ?", [idGenero]
    );
    return rows[0].affectedRows;
}
// QUANTITIE
export const countAllGenres = async (): Promise<number> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT COUNT(*) as cant FROM generos"
    );
    return +rows[0].cant;
}
// EXISTS
export const existsGenre = async (idGenero: number): Promise<boolean> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT 1 FROM generos WHERE id_genero = ?", [idGenero]
    );
    return !!rows[0];
} 