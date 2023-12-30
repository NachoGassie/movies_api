import { corsMiddleware, errorHandler } from "@middlewares";
import { authRouter, defaultRouter, genresRouter, mainRouter, moviesRouter, swaggerSpec } from "@v1Routes";
import express from "express";
import { join } from "path";
import swaggerUI from "swagger-ui-express";

const app = express();

// Initial middlewares
app .use(corsMiddleware)
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    .disable("x-powered-by");

app .use("/api/v1/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec))
    .use("", mainRouter)
    .use("/api/v1/movies", moviesRouter)
    .use("/api/v1/genres", genresRouter)
    .use("/api/v1/auth", authRouter)
    // .use("/api/v1/movie/poster", express.static(join(__dirname, "./public/posters")))
    .use(defaultRouter);

app.use(errorHandler);

export default app;