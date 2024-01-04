import { join } from "path";
import swaggerJsDoc from "swagger-jsdoc";
import { PORT } from "../config";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Movies - API", 
            version: "1.0.0"
        },
        servers: [
            {
                url: `http://localhost:${PORT}`
            }
        ]
    },
    apis: [ 
        join(__dirname, "./routes/movies/movies.router.ts"),
        join(__dirname, "./routes/genres/genres.router.ts"),
        join(__dirname, "./routes/auth/auth.router.ts")
    ]
}

export default swaggerJsDoc(options)