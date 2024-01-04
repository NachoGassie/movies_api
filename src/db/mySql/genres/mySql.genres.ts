import { mySqlPool as pool} from "../";
import { GenreQueries } from "../../../model";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// Get All Genres
export const getAllGenres = async ({ pag, limit, order, sort }: GenreQueries) => {
    pag = (pag-1)*limit;

    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM generos ORDER BY ${order} ${sort} LIMIT ?, ?`, [pag, limit] 
    );
    return rows;
}
// filtered
export const getOneGenre = async (idGenero: number) => {
    const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM generos WHERE id_genero = ?", [idGenero]
    );
    return rows[0];
}
// By column
export const getGenresId = async () => {
    const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT id_genero FROM generos"
    );
    return rows;
}
export const getGenresName = async () => {
    const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT genero from generos"
    );
    return rows;
}
// CUD
export const createOneGenre = async(newGenre: string) => {
    const rows = await pool.query<ResultSetHeader>(
        "INSERT INTO GENEROS (genero) values(?)", [newGenre]
    );
    return rows[0].insertId;
}
export const updateOneGenre = async (newGenre: string, id: number) => {
    const rows = await pool.query<ResultSetHeader>(
        "UPDATE GENEROS SET genero = ? WHERE id_genero = ?", [newGenre, id]
    );
    return rows[0];
}
export const deleteOneGenre = async(idGenero: number) => {
    const rows = await pool.query<ResultSetHeader>(
        "DELETE FROM generos WHERE id_genero = ?", [idGenero]
    );
    return rows[0].affectedRows;
}
// Exists
export const existsGenre = async (idGenero: number) => {
    const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT 1 FROM generos WHERE id_genero = ?", [idGenero]
    );
    return !!rows[0];
} 
// Cant
export const countAllGenres = async () => {
    const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT COUNT(*) as cant FROM generos"
    );
    return +rows[0].cant;
}