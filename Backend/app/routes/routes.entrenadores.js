import { Router } from 'express';
import EntrenadorController from '../controllers/controllers.entrenadores.js';
import { verifyToken } from '../middlewares/middlewares.auth.js';
import { verifyRoles } from '../middlewares/middlewares.roles.js';
import { validateCreateEntrenador, validateUpdateEntrenador, validateId } from '../validators/validators.entrenadores.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Entrenadores
 *   description: Gestión de perfiles de entrenadores
 */

router.use(verifyToken);

/**
 * @swagger
 * /entrenadores:
 *   get:
 *     summary: Obtener lista de entrenadores
 *     tags: [Entrenadores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de entrenadores obtenida exitosamente
 */
// Solo Admin puede crear, actualizar y ver todos los entrenadores
router.get('/', verifyRoles('Administrador'), EntrenadorController.getAll);

/**
 * @swagger
 * /entrenadores:
 *   post:
 *     summary: Registrar un nuevo entrenador
 *     tags: [Entrenadores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario_id
 *               - especialidad
 *             properties:
 *               usuario_id:
 *                 type: integer
 *               especialidad:
 *                 type: string
 *               experiencia_anios:
 *                 type: integer
 *               licencia:
 *                 type: string
 *     responses:
 *       201:
 *         description: Entrenador registrado exitosamente
 */
router.post('/', verifyRoles('Administrador'), validateCreateEntrenador, EntrenadorController.create);

/**
 * @swagger
 * /entrenadores/{id}:
 *   get:
 *     summary: Obtener perfil de un entrenador por ID
 *     tags: [Entrenadores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del entrenador
 *     responses:
 *       200:
 *         description: Datos del entrenador
 *       404:
 *         description: Entrenador no encontrado
 */
// Entrenador puede ver su propio perfil (se valida en controller o confía en ruta propia)
router.get('/:id', validateId, EntrenadorController.getById);

/**
 * @swagger
 * /entrenadores/{id}:
 *   put:
 *     summary: Actualizar perfil de entrenador
 *     tags: [Entrenadores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del entrenador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               especialidad:
 *                 type: string
 *               experiencia_anios:
 *                 type: integer
 *               licencia:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
 */
// Actualizar solo Admin
router.put('/:id', verifyRoles('Administrador'), validateUpdateEntrenador, EntrenadorController.update);

export default router;
