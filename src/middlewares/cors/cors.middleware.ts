import { UnathrorizedError } from "../../httpResponse";
import cors from "cors";

const ACCEPTED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3040",
    "http://localhost:5173",
    "http://localhost:10000",
    "https://movies-api-idv6.onrender.com/",
];

function isOriginIncluded (origin: string): boolean {
    return ACCEPTED_ORIGINS.includes(origin);
}

export default cors({
    origin: (origin, cb) => {

        if (!origin || isOriginIncluded(origin)) {
            return cb(null, true);
        }
        
        return cb(new UnathrorizedError("not allowed by cors"));
    }
});