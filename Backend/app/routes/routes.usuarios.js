import { Router } from 'express';
import UsuarioController from '../controllers/controllers.usuarios.js';
import { verifyToken } from '../middlewares/middlewares.auth.js';
import { verifyRoles, verifyPermisos } from '../middlewares/middlewares.roles.js';
import { validateCreateUsuario, validateUpdateUsuario, validateId } from '../validators/validators.usuarios.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios del sistema
 */

// Todos los endpoints de usuarios requieren autenticación y rol de Administrador
router.use(verifyToken);
router.use(verifyRoles('Administrador'));
router.use(verifyPermisos('usuarios.all'));

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtener lista de usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuariosListResponse'
 */
router.get('/', UsuarioController.getAll);
/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Datos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioResponse'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 */
router.get('/:id', validateId, UsuarioController.getById);

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crear nuevo usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioCreate'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
router.post('/', validateCreateUsuario, UsuarioController.create);

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Actualizar usuario existente
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioUpdate'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 */
router.put('/:id', validateUpdateUsuario, UsuarioController.update);

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Eliminar (suspender) un usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 */
router.delete('/:id', validateId, UsuarioController.delete);

export default router;
