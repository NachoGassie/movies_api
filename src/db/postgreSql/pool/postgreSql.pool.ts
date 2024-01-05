import { Pool } from "pg";
import { PG_URL } from "../../../config";

const pgPool = new Pool({
    connectionString: PG_URL
});

export default pgPool;