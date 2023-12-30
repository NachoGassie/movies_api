import * as moviesController from "@controller/movie";
import { controllerTryCatch, posterMiddleware, validateToken } from "@middlewares";
import { ValidationTypes } from "@model";
import express from "express";

const router = express.Router();

/**
 * @swagger
 * components: 
 *  schemas:
 *    Movie:
 *      type: object
 *      properties: 
 *        id: 
 *          type: number
 *        titulo: 
 *          type: string
 *        sinopsis: 
 *          type: string
 *        anioLanzamiento: 
 *          type: number
 *        poster: 
 *          type: string
 *          format: binary
 *        idGenero: 
 *          type: number
 *        genero: 
 *          type: string
 *      required: 
 *        - id
 *        - titulo 
 *        - sinopsis 
 *        - anioLanzamiento 
 *        - poster 
 *        - idGenero
 *        - genero
 *      example: 
 *        id: 1
 *        titulo: La La land
 *        sinopsis: una pelicula de baile
 *        anioLanzamiento: 2016
 *        poster: la_la_land.jpg
 *        idGenero: 8
 *        genero: musical
 *    MovieReq:
 *      type: object
 *      properties: 
 *        titulo: 
 *          type: string
 *        sinopsis: 
 *          type: string
 *        anioLanzamiento: 
 *          type: number
 *        poster: 
 *          type: string
 *          format: binary
 *        idGenero: 
 *          type: number
 *      required: 
 *        - titulo 
 *        - sinopsis 
 *        - anioLanzamiento 
 *        - poster 
 *        - idGenero
 *      example: 
 *        titulo: La La land
 *        sinopsis: una pelicula de baile
 *        anioLanzamiento: 2016
 *        poster: la_la_land.jpg
 *        idGenero: 8
 *    MovieUpdateReq:
 *      type: object
 *      properties: 
 *        titulo: 
 *          type: string
 *        sinopsis: 
 *          type: string
 *        anioLanzamiento: 
 *          type: number
 *        poster: 
 *          type: string
 *          format: binary
 *        idGenero: 
 *          type: number
 *      example: 
 *        titulo: La La land
 *        sinopsis: una pelicula de baile
 *        anioLanzamiento: 2016
 *        poster: la_la_land.jpg
 *        idGenero: 8
 */

/**
 * @swagger
 * /api/v1/movies/poster/{posterName}:
 *   get:
 *     summary: Obtener un poster
 *     tags: [Movie]
 *     parameters:
 *       - in: path
 *         name: posterName
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre del poster
 *         example: la la land_1703842298838.jpg
 *     responses:
 *       200:
 *         description: Poster recibido con éxito
 *         content:
 *           image/jpeg:
 *             example: "base64-encoded-image-data"
 *           image/jpg:
 *             example: "base64-encoded-image-data"
 *           image/png:
 *             example: "base64-encoded-image-data"
 *       400:
 *          description: El nombre del poster no se encuentra en el formato 'name_id.ext' o no posee una extension permitida(jpg, jpeg, png)
 *       404:
 *          description: El poster no está disponible
 *       500:
 *         description: Error interno 
 */
router.use("/poster", controllerTryCatch(moviesController.getPoster));
/**
 * @swagger
 * /api/v1/movies:
 *   get:
 *     summary: Obtener todas las películas
 *     tags: [Movie]
 *     parameters:
 *       - in: query
 *         name: pag
 *         schema:
 *           type: integer
 *         description: Página actual - default 1
 *       - in: query
 *         name: limit 
 *         schema:
 *           type: integer
 *         description: Cantidad de elementos por página - default 10
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Orden de clasificación (asc o desc) - default asc
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *         description: Campo por el cual ordenar(id, titulo, sinopsis o anioLanzamiento) - default id
 *     responses:
 *       200:
 *         description: Películas recibidas con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCount: 
 *                   type: number
 *                   description: cantidad total de peliculas
 *                 pagesCount:
 *                   type: string
 *                   description: página actual / página maxima
 *                 next: 
 *                   type: string
 *                   description: url de la página siguiente
 *                 prev:
 *                   type: string
 *                   description: url de la página anterior
 *                 movies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 *             example:
 *               totalCount: 22
 *               pagesCount: 1/3
 *               next: /api/v1/movies?pag=2&limit=10&sort=asc&order=id
 *               prev: null
 *               movies:
 *                 - id: 1
 *                   titulo: La La land
 *                   anio_lanzamiento: 2016
 *                   sinopsis: una pelicula de baile
 *                   poster: la_la_land_1703194824054.jpg   
 *                   id_genero: 8
 *                   genero: musical
 *       400:
 *         description: Parametros incorrectos
 *       404:
 *          description: No hay películas disponibles
 *       500:
 *         description: Error interno 
 */
router.get("/",  controllerTryCatch(moviesController.getAllMovies));
/**
 * @swagger
 * /api/v1/movies/{movieId}:
 *   get:
 *     summary: Obtener una película por su ID
 *     tags: [Movie]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         schema:
 *           type: number
 *         required: true
 *         description: ID de la película
 *     responses:
 *       200:
 *         description: Película recibida con éxito
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#/components/schemas/Movie'
 *       400:
 *         description: ID no es un entero posivito
 *       404:
 *          description: No hay una película cuyo ID coincida con el solicitado
 *       500:
 *         description: Error interno 
 */
router.get("/:movieId",  controllerTryCatch(moviesController.getMovieById));
/**
 * @swagger
 * /api/v1/movies/genre/{genreId}:
 *   get:
 *     summary: Obtener todas las películas filtradas por género
 *     tags: [Movie]
 *     parameters:
 *       - in: path
 *         name: genreId
 *         schema:
 *           type: number
 *         required: true
 *         description: ID del género para filtrar
 *       - in: query
 *         name: pag
 *         schema:
 *           type: integer
 *         description: Página actual
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Cantidad de elementos por página
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Orden de clasificación (asc o desc)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *         description: Campo por el cual ordenar (id, titulo, sinopsis o anioLanzamiento)
 *     responses:
 *       200:
 *         description: Películas recibidas con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCount:
 *                   type: number
 *                   description: cantidad total de películas
 *                 pagesCount:
 *                   type: string
 *                   description: página actual / página máxima
 *                 next:
 *                   type: string
 *                   description: URL de la página siguiente
 *                 prev:
 *                   type: string
 *                   description: URL de la página anterior
 *                 movies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 *             example:
 *               totalCount: 22
 *               pagesCount: 1/3
 *               next: /api/v1/movies?pag=2&limit=10&sort=asc&order=id
 *               prev: null
 *               movies:
 *                 - id: 1
 *                   titulo: La La land
 *                   anio_lanzamiento: 2016
 *                   sinopsis: una película de baile
 *                   poster: la_la_land_1703194824054.jpg   
 *                   id_genero: 8
 *                   genero: musical
 *                 - id: 2
 *                   titulo: Otro musical
 *                   anio_lanzamiento: 2020
 *                   sinopsis: Descripción de otro musical
 *                   poster: otra_pelicula_1703194824054.jpg    
 *                   id_genero: 8
 *                   genero: musical
 *       400:
 *         description: Parametros incorrectos / ID no es un entero positivo
 *       404:
 *          description: No hay peliculas disponibles para el género solicitado
 *       500:
 *         description: Error interno 
 */
router.get("/genre/:genreId",  controllerTryCatch(moviesController.getAllMoviesByGenre));
router.use(validateToken({ validationType: ValidationTypes.REGULAR }));
/**
 * @swagger
 * /api/v1/movies/{movieId}:
 *   delete:
 *     security:
 *          - bearerAuth: []
 *     summary: Eliminar una película por su ID
 *     tags: [Movie]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         schema:
 *           type: number
 *         required: true
 *     responses:
 *       200:
 *         description: Película eliminada con éxito
 *         content:
 *           application/json:
 *             schema:
 *              id:
 *                  type: number
 *                  description: ID de la película eliminada
 *              example:
 *                  id: 1
 *       400:
 *         description: ID no es un entero positivo
 *       401:
 *         description: Token invalido o nulo
 *       404:
 *          description: No hay una película cuyo ID coincida con el solicitado
 *       500:
 *         description: Error interno 
 */
router.delete("/:movieId",  controllerTryCatch(moviesController.deleteOneMovie));
router.use(posterMiddleware);
/**
 * @swagger
 * /api/v1/movies:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Crear una nueva película
 *     tags: [Movie]
 *     requestBody: 
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema: 
 *             $ref: '#/components/schemas/MovieReq'
 *     responses:
 *       201:
 *         description: Película creada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Req Body incompleto o incorrecto
 *       401:
 *         description: Token invalido o nulo
 *       500:
 *         description: Error interno 
 */
router.post("/",  controllerTryCatch(moviesController.createOneMovie));
/**
 * @swagger
 * /api/v1/movies/{movieId}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Actualizar una película
 *     tags: [Movie]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         schema:
 *           type: number
 *         required: true
 *         description: ID de la película a actualizar
 *     requestBody: 
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema: 
 *             $ref: '#/components/schemas/MovieUpdateReq'
 *     responses:
 *       200:
 *         description: Película actualizada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Req Body vacío o incorrecto / ID no es un entero positivo
 *       401:
 *         description: Token invalido o nulo
 *       404:
 *         description: No hay una película cuyo ID coincida con el solicitado
 *       500:
 *         description: Error interno 
 */
router.put("/:movieId",  controllerTryCatch(moviesController.updateOneMovie));

export default router;