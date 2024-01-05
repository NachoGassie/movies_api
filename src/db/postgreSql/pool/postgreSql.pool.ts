import { Pool } from "pg";
import { PG_EXT_URL } from "../../../config";

const pgPool = new Pool({
    connectionString: PG_EXT_URL
});

export default pgPool;