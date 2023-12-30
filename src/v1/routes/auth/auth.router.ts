import express from 'express';
import { controllerTryCatch, validateToken } from "@middlewares";
import * as authController from "@controller/auth";
import { ValidationTypes } from '@model';

const router = express.Router();

/**
 * @swagger
 * 
 * components: 
 *  securitySchemes:
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 *  schemas:
 *    User:
 *      type: object
 *      properties: 
 *        id_user: 
 *          type: number
 *        email: 
 *          type: string
 *        password: 
 *          type: string
 *      required: 
 *        - id_user
 *        - email
 *        - password
 *      example: 
 *        id_user: 1
 *        email: user@user.com
 *        password: contraseña
 *    UserReq:
 *      type: object
 *      properties: 
 *        email: 
 *          type: string
 *        password: 
 *          type: string
 *      required: 
 *        - email
 *        - password
 *      example: 
 *        email: user@user.com
 *        password: contraseña
 *    UserUpdateReq:
 *      type: object
 *      properties: 
 *        email: 
 *          type: string
 *        password: 
 *          type: string
 *      example: 
 *        email: user@user.com
 *        password: contraseña
 */

/**
 * @swagger
 * /api/v1/auth:
 *   post:
 *     summary: Obtener un token a través de un usuario
 *     tags: [User]
 *     requestBody: 
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             $ref: '#/components/schemas/UserReq'
 *     responses:
 *       200:
 *         description: Token generado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user: 
 *                   type: object
 *                   properties:
 *                      id_user: 
 *                          type: number
 *                      email:
 *                          type: string
 *                 token:
 *                   type: string
 *                   description: El token generado
 *             example:
 *               user:
 *                 id_user: 1
 *                 email: user@user.com
 *               token: xxxxxxxxxxxxxxxxxxxxx
 *       400:
 *          description: Req body incompleto o incorrecto
 *       401:
 *          description: Email y/o contraseña incorrectos
 *       500:
 *         description: Error interno 
 */
router.post('/', controllerTryCatch(authController.validateUser));
/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: Crear un usuario
 *     tags: [User]
 *     requestBody: 
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             $ref: '#/components/schemas/UserReq'
 *     responses:
 *       201:
 *         description: Usuario creado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user: 
 *                   type: object
 *                   properties:
 *                      id_user: 
 *                          type: number
 *                      email:
 *                          type: string
 *             example:
 *               id_user: 1
 *               email: user@user.com
 *       400:
 *          description: Req body incompleto o incorrecto / Email ya registrado
 *       500:
 *         description: Error interno 
 */
router.post('/signup', controllerTryCatch(authController.createUser));
router.use('/:userId', validateToken({ validationType: ValidationTypes.USERMOD }));
/**
 * @swagger
 * /api/v1/auth/{userId}:
 *   patch:
 *     security:
 *          - bearerAuth: []
 *     summary: Actualizar un usuario
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: number
 *         required: true
 *         description: ID del usuario a actualizar
 *     requestBody: 
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             $ref: '#/components/schemas/UserUpdateReq'
 *     responses:
 *       200:
 *         description: Usuario actualizado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_user:
 *                   type: number
 *                   description: ID del usuario modificado
 *             example:
 *               id_user: 1
 *       400:
 *          description: Req body incorrecto / ID no es un entero posivito
 *       401:
 *          description: Token invalido o nulo
 *       403:
 *          description: Token no entregado al usuario que desea eliminar
 *       404:
 *          description: No hay un usuario cuyo ID coincida con el solicitado
 *       500:
 *         description: Error interno 
 */
router.patch('/:userId', controllerTryCatch(authController.updateUser));
/**
 * @swagger
 * /api/v1/auth/{userId}:
 *   delete:
 *     security:
 *          - bearerAuth: []
 *     summary: Eliminar un usuario por su ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: number
 *         required: true
 *     responses:
 *       200:
 *         description: género eliminado con éxito
 *         content:
 *           application/json:
 *             schema:
 *              id_genero:
 *                  type: number
 *                  description: ID del género eliminado
 *              example:
 *                  id: 1
 *       400:
 *          description: ID no es un entero posivito
 *       401:
 *          description: Token invalido o nulo
 *       403:
 *          description: Token no entregado al usuario que desea eliminar
 *       404:
 *          description: No hay un usuario cuyo ID coincida con el solicitado
 *       500:
 *         description: Error interno 
 */
router.delete('/:userId', controllerTryCatch(authController.deleteUser));

export default router;