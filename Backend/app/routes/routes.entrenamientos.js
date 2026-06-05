import { Router } from 'express';
import EntrenamientoController from '../controllers/controllers.entrenamientos.js';
import { verifyToken } from '../middlewares/middlewares.auth.js';
import { verifyRoles } from '../middlewares/middlewares.roles.js';
import { validateCreateEntrenamiento, validateUpdateEntrenamiento, validateAsistencia, validateId } from '../validators/validators.entrenamientos.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Entrenamientos
 *   description: Gestión de sesiones de entrenamiento y asistencias
 */

router.use(verifyToken);

/**
 * @swagger
 * /entrenamientos:
 *   get:
 *     summary: Obtener lista de entrenamientos
 *     tags: [Entrenamientos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de entrenamientos obtenida exitosamente
 */
// Listar todos los entrenamientos (cada rol verá los suyos filtrados en el service)
router.get('/', EntrenamientoController.getAll);

/**
 * @swagger
 * /entrenamientos/{id}:
 *   get:
 *     summary: Obtener detalle de un entrenamiento y su asistencia
 *     tags: [Entrenamientos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Datos del entrenamiento y asistencia
 */
// Detalle de un entrenamiento y su asistencia
router.get('/:id', validateId, EntrenamientoController.getById);

/**
 * @swagger
 * /entrenamientos:
 *   post:
 *     summary: Programar un nuevo entrenamiento
 *     tags: [Entrenamientos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoria_id:
 *                 type: integer
 *               fecha:
 *                 type: string
 *                 format: date
 *               hora_inicio:
 *                 type: string
 *               hora_fin:
 *                 type: string
 *               ubicacion:
 *                 type: string
 *               tipo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Entrenamiento creado
 */
// Programar un entrenamiento (Admin y Entrenador)
router.post('/', verifyRoles('Administrador', 'Entrenador'), validateCreateEntrenamiento, EntrenamientoController.create);

/**
 * @swagger
 * /entrenamientos/{id}:
 *   put:
 *     summary: Actualizar un entrenamiento
 *     tags: [Entrenamientos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha:
 *                 type: string
 *               hora_inicio:
 *                 type: string
 *               hora_fin:
 *                 type: string
 *               ubicacion:
 *                 type: string
 *               estado:
 *                 type: string
 *     responses:
 *       200:
 *         description: Entrenamiento actualizado
 */
// Actualizar un entrenamiento
router.put('/:id', verifyRoles('Administrador', 'Entrenador'), validateUpdateEntrenamiento, EntrenamientoController.update);

/**
 * @swagger
 * /entrenamientos/{id}/asistencia:
 *   post:
 *     summary: Registrar asistencia a un entrenamiento
 *     tags: [Entrenamientos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               asistencias:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     jugador_id:
 *                       type: integer
 *                     estado:
 *                       type: string
 *                       enum: [presente, ausente, excusado, tardanza]
 *                     minutos_jugados:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Asistencia registrada
 */
// Registrar asistencia (Admin y Entrenador)
router.post('/:id/asistencia', verifyRoles('Administrador', 'Entrenador'), validateAsistencia, EntrenamientoController.registerAsistencia);

export default router;
