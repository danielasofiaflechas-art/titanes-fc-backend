import { Router } from 'express';
import FinanzasController from '../controllers/controllers.finanzas.js';
import { verifyToken } from '../middlewares/middlewares.auth.js';
import { verifyRoles } from '../middlewares/middlewares.roles.js';
import { validateGenerarLote, validatePago, validateRegistroInscripcion } from '../validators/validators.finanzas.js';

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Finanzas
 *   description: Gestión de pagos, mensualidades e inscripciones
 */

router.use(verifyToken);

/**
 * @swagger
 * /finanzas/mensualidades:
 *   get:
 *     summary: Obtener estado de mensualidades
 *     tags: [Finanzas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de mensualidades
 */
// Mensualidades
router.get('/mensualidades', FinanzasController.getMensualidades);

/**
 * @swagger
 * /finanzas/mensualidades/lote:
 *   post:
 *     summary: Generar mensualidades en lote
 *     tags: [Finanzas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mes:
 *                 type: integer
 *               anio:
 *                 type: integer
 *               monto_base:
 *                 type: number
 *     responses:
 *       201:
 *         description: Mensualidades generadas
 */
router.post('/mensualidades/lote', verifyRoles('Administrador'), validateGenerarLote, FinanzasController.generarMensualidadesLote);

/**
 * @swagger
 * /finanzas/mensualidades/{id}/pago:
 *   post:
 *     summary: Registrar pago de mensualidad
 *     tags: [Finanzas]
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
 *               metodo_pago:
 *                 type: string
 *               referencia:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pago registrado
 */
router.post('/mensualidades/:id/pago', verifyRoles('Administrador'), validatePago, FinanzasController.pagarMensualidad);

/**
 * @swagger
 * /finanzas/inscripciones:
 *   get:
 *     summary: Obtener pagos de inscripciones
 *     tags: [Finanzas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de inscripciones
 */
// Inscripciones a Campeonatos
router.get('/inscripciones', verifyRoles('Administrador'), FinanzasController.getInscripciones);

/**
 * @swagger
 * /finanzas/inscripciones:
 *   post:
 *     summary: Registrar pago de inscripción
 *     tags: [Finanzas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               campeonato_id:
 *                 type: integer
 *               equipo_id:
 *                 type: integer
 *               monto:
 *                 type: number
 *               metodo_pago:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pago de inscripción registrado
 */
router.post('/inscripciones', verifyRoles('Administrador'), validateRegistroInscripcion, FinanzasController.registrarInscripcion);

/**
 * @swagger
 * /finanzas/historial:
 *   get:
 *     summary: Obtener historial de caja (ingresos/egresos)
 *     tags: [Finanzas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historial de movimientos
 */
// Historial de Caja
router.get('/historial', verifyRoles('Administrador'), FinanzasController.getHistorial);

export default router;
