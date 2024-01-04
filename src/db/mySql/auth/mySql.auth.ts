import { mySqlPool as pool} from "../";
import { NewUser, UpdateUser } from "../../../model";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// GET
export const getUserById = async (id: number) => {
    const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM users WHERE id_user = ?", [id]
    );
    return rows[0];
}
export const getUserByEmail = async (email: string) => {
    const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM users WHERE email = ?", [email]
    );
    return rows[0];
}
// CUD
export const createOneUser = async (user: NewUser) => {
    const { email, password } = user;
    const rows = await pool.query<ResultSetHeader>(
        "INSERT INTO users (email, password) VALUES (?,?)", [email, password]
    );
    return rows[0].insertId;
}
export const updateOneUser = async (newUser: UpdateUser, id: number) => {
    const { email, password } = newUser;
    const rows = await pool.query<ResultSetHeader>(
        `UPDATE users SET email = IFNULL(?, email), password = IFNULL(?, password) 
        WHERE id_user = ?`, [email, password, id]
    );
    return rows[0].affectedRows;
}
export const deleteOneUser = async (id: number) => {
    const rows = await pool.query<ResultSetHeader>(
        "DELETE FROM users WHERE id_user = ?", [id]
    );
    return rows[0].affectedRows;
}
// EXISTS
export const existsUser = async (id: number) => {
    const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT 1 FROM users WHERE id_user = ?", [id]
    );
    return !!rows[0];
}
export const existsUserByEmail = async (email: string) => {
    const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT 1 FROM users WHERE email = ?", [email]
    );
    return !!rows[0];
}