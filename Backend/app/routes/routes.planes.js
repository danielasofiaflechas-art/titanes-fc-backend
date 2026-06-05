import { Router } from 'express';
import PlanController from '../controllers/controllers.planes.js';
import { verifyToken } from '../middlewares/middlewares.auth.js';
import { verifyRoles } from '../middlewares/middlewares.roles.js';
import { validateCreateEjercicio, validateCreatePlan, validateUpdateEstadoPlan, validateId } from '../validators/validators.planes.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Planes
 *   description: Gestión de planes de entrenamiento y ejercicios
 */

router.use(verifyToken);

/**
 * @swagger
 * /planes/ejercicios:
 *   get:
 *     summary: Obtener catálogo de ejercicios
 *     tags: [Planes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de ejercicios
 */
// -- EJERCICIOS --
router.get('/ejercicios', PlanController.getEjercicios);

/**
 * @swagger
 * /planes/ejercicios:
 *   post:
 *     summary: Crear un nuevo ejercicio
 *     tags: [Planes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               tipo:
 *                 type: string
 *               dificultad:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ejercicio creado
 */
router.post('/ejercicios', verifyRoles('Administrador', 'Entrenador'), validateCreateEjercicio, PlanController.createEjercicio);

/**
 * @swagger
 * /planes:
 *   get:
 *     summary: Obtener lista de planes de entrenamiento
 *     tags: [Planes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de planes
 */
// -- PLANES DE ENTRENAMIENTO --
router.get('/', PlanController.getPlanes);

/**
 * @swagger
 * /planes/{id}:
 *   get:
 *     summary: Obtener detalle de un plan de entrenamiento
 *     tags: [Planes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos del plan
 */
router.get('/:id', validateId, PlanController.getPlanById);

/**
 * @swagger
 * /planes:
 *   post:
 *     summary: Crear un plan de entrenamiento
 *     tags: [Planes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               entrenador_id:
 *                 type: integer
 *               jugador_id:
 *                 type: integer
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               fecha_inicio:
 *                 type: string
 *                 format: date
 *               fecha_fin:
 *                 type: string
 *                 format: date
 *               ejercicios:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     ejercicio_id:
 *                       type: integer
 *                     series:
 *                       type: integer
 *                     repeticiones:
 *                       type: integer
 *                     descanso_segundos:
 *                       type: integer
 *                     orden:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Plan creado
 */
router.post('/', verifyRoles('Administrador', 'Entrenador'), validateCreatePlan, PlanController.createPlan);

/**
 * @swagger
 * /planes/{id}/estado:
 *   patch:
 *     summary: Actualizar estado de un plan (Solo Jugador)
 *     tags: [Planes]
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
 *               estado:
 *                 type: string
 *                 enum: [asignado, en_progreso, completado, cancelado]
 *     responses:
 *       200:
 *         description: Estado actualizado
 */
// Actualizar estado del plan (Solo Jugador)
router.patch('/:id/estado', verifyRoles('Jugador'), validateUpdateEstadoPlan, PlanController.updateEstadoPlanJugador);

export default router;
