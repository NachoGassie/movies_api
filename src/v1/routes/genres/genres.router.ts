import express from "express";
import * as genreController from "@controller/genre";
import { controllerTryCatch, validateToken } from "@middlewares";
import { ValidationTypes } from "@model";

const router = express.Router();

/**
 * @swagger
 * components: 
 *  schemas:
 *    Genre:
 *      type: object
 *      properties: 
 *        id_genero: 
 *          type: number
 *        genero: 
 *          type: string
 *      required: 
 *        - id_genero
 *        - genero
 *      example: 
 *        id_genero: 5
 *        genero: comedia
 *    GenreReq:
 *      type: object
 *      properties: 
 *        genero: 
 *          type: string
 *      required: 
 *        - genero
 *      example: 
 *        genero: comedia
 */

/**
 * @swagger
 * /api/v1/genres:
 *   get:
 *     summary: Obtener todas las Géneros
 *     tags: [Genre]
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
 *         description: Campo por el cual ordenar(id_genero, genero) - default id
 *     responses:
 *       200:
 *         description: Géneros recibidas con éxito
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
 *                 genres:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Genre'
 *             example:
 *               totalCount: 12
 *               pagesCount: 1/2
 *               next: /api/v1/genres?pag=2&limit=10&sort=asc&order=id_genero
 *               prev: null
 *               genres:
 *                 - id_genero: 5
 *                   genero: comedia
 *       400:
 *         description: Parametros incorrectos
 *       404:
 *          description: No hay géneros disponibles
 *       500:
 *         description: Error interno 
 */
router.get("/", controllerTryCatch(genreController.getAllGenres));
/**
 * @swagger
 * /api/v1/genres/{genreId}:
 *   get:
 *     summary: Obtener un género por su ID
 *     tags: [Genre]
 *     parameters:
 *       - in: path
 *         name: genreId
 *         schema:
 *           type: number
 *         required: true
 *         description: ID del género
 *     responses:
 *       200:
 *         description: Género recibido con éxito
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#/components/schemas/Genre'
 *       400:
 *         description: ID no es un entero posivito
 *       404:
 *          description: No hay un género cuyo ID coincida con el solicitado
 *       500:
 *         description: Error interno 
 */
router.get("/:genreId", controllerTryCatch(genreController.getOneGenre));
router.use(validateToken({ validationType: ValidationTypes.REGULAR }));
/**
 * @swagger
 * /api/v1/genres:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Crear un nuevo género
 *     tags: [Genre]
 *     requestBody: 
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             $ref: '#/components/schemas/GenreReq'
 *     responses:
 *       201:
 *         description: Género creado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Genre'
 *       400:
 *         description: Género incorrecto o no enviado
 *       401:
 *         description: Token inválido o nulo
 *       500:
 *         description: Error interno
 */
router.post("/", controllerTryCatch(genreController.createOneGenre));
/**
 * @swagger
 * /api/v1/genres/{genreId}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Actualizar un género
 *     tags: [Genre]
 *     parameters:
 *       - in: path
 *         name: genreId
 *         schema:
 *           type: number
 *         required: true
 *         description: ID del género a actualizar
 *     requestBody: 
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             $ref: '#/components/schemas/GenreReq'
 *     responses:
 *       200:
 *         description: Género actualizado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Genre'
 *       400:
 *         description: Género incorrecto o no enviado / ID no es un entero positivo
 *       401:
 *         description: Token inválido o nulo
 *       404:
 *         description: No hay un género cuyo ID coincida con el solicitado
 *       500:
 *         description: Error interno 
 */

router.put("/:genreId", controllerTryCatch(genreController.updateOneGenre));
/**
 * @swagger
 * /api/v1/genres/{genreId}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Eliminar un género por su ID
 *     tags: [Genre]
 *     parameters:
 *       - in: path
 *         name: genreId
 *         schema:
 *           type: number
 *         required: true
 *     responses:
 *       200:
 *         description: Género eliminado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_genero:
 *                   type: number
 *                   description: ID del género eliminado
 *             example:
 *               id_genero: 1
 *       400:
 *         description: ID no es un entero positivo
 *       401:
 *         description: Token inválido o nulo
 *       404:
 *          description: No hay un género cuyo ID coincida con el solicitado
 *       500:
 *         description: Error interno 
 */
router.delete("/:genreId", controllerTryCatch(genreController.deleteOneGenre));

export default router;