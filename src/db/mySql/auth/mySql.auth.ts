import { mySqlPool as pool} from "../";
import { NewUser, UpdateUser, User } from "../../../model";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// GET
export const getUserById = async (id: number): Promise<User> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM users WHERE id_user = ?", [id]
    );
    return rows[0] as User;
}
export const getUserByEmail = async (email: string): Promise<User> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM users WHERE email = ?", [email]
    );
    return rows[0] as User;
}
// CUD
export const createOneUser = async (user: NewUser): Promise<number> => {
    const { email, password } = user;
    const rows = await pool.query<ResultSetHeader>(
        "INSERT INTO users (email, password) VALUES (?,?)", [email, password]
    );
    return rows[0].insertId;
}
export const updateOneUser = async (newUser: UpdateUser, id: number): Promise<number> => {
    const { email, password } = newUser;
    const rows = await pool.query<ResultSetHeader>(
        `UPDATE users SET email = IFNULL(?, email), password = IFNULL(?, password) 
        WHERE id_user = ?`, [email, password, id]
    );
    return rows[0].affectedRows;
}
export const deleteOneUser = async (id: number): Promise<number> => {
    const rows = await pool.query<ResultSetHeader>(
        "DELETE FROM users WHERE id_user = ?", [id]
    );
    return rows[0].affectedRows;
}
// EXISTS
export const existsUser = async (id: number): Promise<boolean> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT 1 FROM users WHERE id_user = ?", [id]
    );
    return !!rows[0];
}
export const existsUserByEmail = async (email: string): Promise<boolean> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT 1 FROM users WHERE email = ?", [email]
    );
    return !!rows[0];
}