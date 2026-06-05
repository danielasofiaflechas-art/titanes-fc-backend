import { Router } from 'express';
import RendimientoController from '../controllers/controllers.rendimiento.js';
import { verifyToken } from '../middlewares/middlewares.auth.js';
import { verifyRoles } from '../middlewares/middlewares.roles.js';
import { validateCreateTestConfig, validateRegisterTest, validateEvaluacion, validateId } from '../validators/validators.rendimiento.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Rendimiento
 *   description: Evaluaciones físicas y de rendimiento de jugadores
 */

router.use(verifyToken);

/**
 * @swagger
 * /rendimiento/configuracion:
 *   get:
 *     summary: Obtener configuración de tests físicos
 *     tags: [Rendimiento]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de configuraciones
 */
// --- Configuración de Tests ---
router.get('/configuracion', RendimientoController.getTestsConfig);

/**
 * @swagger
 * /rendimiento/configuracion:
 *   post:
 *     summary: Crear configuración de test físico
 *     tags: [Rendimiento]
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
 *               tipo_metrica:
 *                 type: string
 *               unidad_medida:
 *                 type: string
 *     responses:
 *       201:
 *         description: Configuración creada
 */
router.post('/configuracion', verifyRoles('Administrador'), validateCreateTestConfig, RendimientoController.createTestConfig);

/**
 * @swagger
 * /rendimiento/tests:
 *   post:
 *     summary: Registrar resultado de test físico para un jugador
 *     tags: [Rendimiento]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jugador_id:
 *                 type: integer
 *               test_id:
 *                 type: integer
 *               fecha:
 *                 type: string
 *                 format: date
 *               resultado:
 *                 type: number
 *               observaciones:
 *                 type: string
 *     responses:
 *       201:
 *         description: Resultado registrado
 */
// --- Registro de Rendimiento (Solo Entrenador o Admin) ---
router.post('/tests', verifyRoles('Administrador', 'Entrenador'), validateRegisterTest, RendimientoController.registerTestResultado);

/**
 * @swagger
 * /rendimiento/evaluaciones:
 *   post:
 *     summary: Registrar evaluación periódica de un jugador
 *     tags: [Rendimiento]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jugador_id:
 *                 type: integer
 *               entrenador_id:
 *                 type: integer
 *               periodo:
 *                 type: string
 *               calificacion_tecnica:
 *                 type: number
 *               calificacion_tactica:
 *                 type: number
 *               calificacion_fisica:
 *                 type: number
 *               calificacion_psicologica:
 *                 type: number
 *               comentarios:
 *                 type: string
 *     responses:
 *       201:
 *         description: Evaluación registrada
 */
router.post('/evaluaciones', verifyRoles('Administrador', 'Entrenador'), validateEvaluacion, RendimientoController.registerEvaluacionPeriodica);

/**
 * @swagger
 * /rendimiento/dashboard/{id}:
 *   get:
 *     summary: Obtener dashboard de rendimiento de un jugador
 *     tags: [Rendimiento]
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
 *         description: Dashboard de rendimiento
 */
// --- Dashboard y Resultados del Jugador ---
// Un jugador puede ver su dashboard (validado en service) o un Entrenador/Admin puede ver el de cualquier jugador.
router.get('/dashboard/:id', validateId, RendimientoController.getDashboardJugador);

export default router;
