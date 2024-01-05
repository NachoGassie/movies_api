import { Pool } from "pg";
import { PG_EXT_URL } from "../../../config";

// const pgPool = new Pool({
//     user: PG_USER,
//     host: PG_HOST,
//     database: PG_DATABASE,
//     password: PG_PASSWORD,
//     port: PG_PORT,
// });
const pgPool = new Pool({
    connectionString: PG_EXT_URL,
    ssl: true
});

export default pgPool;