import { Router } from 'express';
import { body } from 'express-validator';
import AuthController from '../controllers/controllers.auth.js';
import { verifyToken } from '../middlewares/middlewares.auth.js';
import { validateResult } from '../middlewares/middlewares.validator.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación de usuarios y gestión de sesión
 */

// Rutas de Autenticación
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', [
    body('email', 'Ingrese un email válido').isEmail(),
    body('password', 'La contraseña es obligatoria').notEmpty(),
    validateResult
], AuthController.login);

// Rutas protegidas con JWT
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cierre de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.post('/logout', verifyToken, AuthController.logout);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Obtener el perfil del usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario actual
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 */
router.get('/me', verifyToken, AuthController.profile);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Renovar token JWT usando refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Token de refresco recibido en el login
 *             required:
 *               - refreshToken
 *     responses:
 *       200:
 *         description: Token renovado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Refresh token faltante
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Refresh token inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 */
router.post('/refresh', AuthController.refresh);

export default router;
