import { config } from "dotenv";
config();

export const PORT = process.env.PORT ?? 3040;
export const HOST = process.env.HOST ?? "localhost";
export const DB_USER = process.env.DB_USER ?? "root";
export const DB_PASSWORD = process.env.DB_PASSWORD ?? "";
export const DB_PORT = Number(process.env.DB_PORT) ?? 3306;
export const DB_DATABASE = process.env.DB_DATABASE ?? "db_peliculas";

export const SECRET = process.env.SECRET ?? "MOVIE_VIP_USER";