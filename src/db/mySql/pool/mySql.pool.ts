import { createPool } from "mysql2/promise";
import { HOST, DB_USER, DB_PASSWORD, DB_PORT, DB_DATABASE } from "../../../config";

const pool = createPool({
    host: HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    database: DB_DATABASE
});

export default pool;
