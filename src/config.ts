import { config } from "dotenv";
config();

export const PORT = process.env.PORT ?? 3040;
export const HOST = process.env.HOST ?? "localhost";
export const DB_USER = process.env.DB_USER ?? "root";
export const DB_PASSWORD = process.env.DB_PASSWORD ?? "";
export const DB_PORT = Number(process.env.DB_PORT) ?? 3306;
export const DB_DATABASE = process.env.DB_DATABASE ?? "db_peliculas";

// export const PG_PORT = Number(process.env.PG_PORT) ?? 5432;
// export const PG_USER = process.env.PG_USER ?? "db_peliculas_user";
// export const PG_HOST = process.env.PG_HOST ?? "dpg-cmbpv6f109ks73ae0nl0-a";
// export const PG_PASSWORD = process.env.PG_PASSWORD ?? "wbMtoYa5Znc3RInA79FD3cTceJApk9B1";
// export const PG_DATABASE = process.env.PG_DATABASE ?? "db_peliculas";
export const PG_EXT_URL = "postgres://db_peliculas_user:wbMtoYa5Znc3RInA79FD3cTceJApk9B1@dpg-cmbpv6f109ks73ae0nl0-a.oregon-postgres.render.com/db_peliculas";


export const PG_PORT = Number(process.env.PG_PORT) ?? 5433;
export const PG_USER = process.env.PG_USER ?? 'postgres';
export const PG_HOST = process.env.PG_HOST ?? 'localhost';
export const PG_PASSWORD = process.env.PG_PASSWORD ?? 'password';
export const PG_DATABASE = process.env.PG_DATABASE ?? 'db_peliculas';


// user: 'postgres',
// host: 'localhost',
// database: 'whatsapp_copy',
// password: 'password',
// port: 5433,

export const SECRET = process.env.SECRET ?? "MOVIE_VIP_USER";