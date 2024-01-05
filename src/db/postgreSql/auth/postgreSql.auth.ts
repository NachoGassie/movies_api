import { NewUser, UpdateUser, User } from "../../../model";
import { postgreSqlPool } from "../pool";

// GET
export const getUserById = async (idUser: number): Promise<User> => {
    const query = {
        text: "SELECT * FROM users WHERE id_user = $1",
        values: [idUser]
    }

    return (await postgreSqlPool.query(query)).rows[0]; 
}
export const getUserByEmail = async (email: string): Promise<User> => {
    const query = {
        text: "SELECT * FROM users WHERE email = $1",
        values: [email]
    }

    return (await postgreSqlPool.query(query)).rows[0]; 
}
// CUD
export const createOneUser = async (user: NewUser): Promise<number> => {
    const { email, password } = user;

    const query = {
        text: 
        "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id_user",
        values: [email, password]
    }

    return (await postgreSqlPool.query(query)).rows[0]; 
}
export const updateOneUser = async (newUser: UpdateUser, id: number): Promise<number | null> => {
    const { email, password } = newUser;

    const query = {
        text: `
            UPDATE users SET email = COALESCE($1, email),
            password = COALESCE($2, password) WHERE id_user = $3
        `,
        values: [email, password, id],
    };

    return (await postgreSqlPool.query(query)).rowCount; 
}
export const deleteOneUser = async (idUser: number): Promise<number | null> => {
    const query = {
        text: "DELETE FROM users WHERE id_user = $1",
        values: [idUser],
    };

    return (await postgreSqlPool.query(query)).rowCount; 
}
// EXISTS
export const existsUser = async (idUser: number): Promise<boolean> => {
    const query = {
        text: "SELECT 1 FROM users WHERE id_user = $1",
        values: [idUser]
    }

    const resp = await postgreSqlPool.query(query);
    return !!resp.rows[0];
}
export const existsUserByEmail = async (email: string): Promise<boolean> => {
    const query = {
        text: "SELECT 1 FROM users WHERE email = $1",
        values: [email]
    }

    const resp = await postgreSqlPool.query(query);
    return !!resp.rows[0];
}