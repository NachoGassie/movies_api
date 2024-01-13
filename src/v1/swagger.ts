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
                url: "https://movies-api-idv6.onrender.com"
            }
        ]
    },
    apis: [ 
        join(__dirname, "./routes/movies/movies.router.*"),
        join(__dirname, "./routes/genres/genres.router.*"),
        join(__dirname, "./routes/auth/auth.router.*")
    ]
}

export default swaggerJsDoc(options)