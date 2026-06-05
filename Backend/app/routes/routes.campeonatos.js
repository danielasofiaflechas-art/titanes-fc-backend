import { Router } from 'express';
import CampeonatoController from '../controllers/controllers.campeonatos.js';
import { verifyToken } from '../middlewares/middlewares.auth.js';
import { verifyRoles } from '../middlewares/middlewares.roles.js';
import { validateCreateCampeonato, validateCreateEquipo, validateInscripcion, validateCreatePartido, validateUpdateResultado } from '../validators/validators.campeonatos.js';

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Campeonatos
 *   description: Gestión de campeonatos, equipos y partidos
 */

router.use(verifyToken);

/**
 * @swagger
 * /campeonatos:
 *   get:
 *     summary: Obtener campeonatos
 *     tags: [Campeonatos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de campeonatos
 */
// Campeonatos
router.get('/', CampeonatoController.getCampeonatos);

/**
 * @swagger
 * /campeonatos:
 *   post:
 *     summary: Crear un campeonato
 *     tags: [Campeonatos]
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
 *               fecha_inicio:
 *                 type: string
 *                 format: date
 *               fecha_fin:
 *                 type: string
 *                 format: date
 *               categoria_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Campeonato creado
 */
router.post('/', verifyRoles('Administrador'), validateCreateCampeonato, CampeonatoController.createCampeonato);

/**
 * @swagger
 * /campeonatos/equipos:
 *   get:
 *     summary: Obtener equipos
 *     tags: [Campeonatos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de equipos
 */
// Equipos
router.get('/equipos', CampeonatoController.getEquipos);

/**
 * @swagger
 * /campeonatos/equipos:
 *   post:
 *     summary: Crear un equipo
 *     tags: [Campeonatos]
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
 *               entrenador_id:
 *                 type: integer
 *               categoria_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Equipo creado
 */
router.post('/equipos', verifyRoles('Administrador'), validateCreateEquipo, CampeonatoController.createEquipo);

/**
 * @swagger
 * /campeonatos/inscribir:
 *   post:
 *     summary: Inscribir un equipo en un campeonato
 *     tags: [Campeonatos]
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
 *               fecha_inscripcion:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Inscripción registrada
 */
// Inscripciones
router.post('/inscribir', verifyRoles('Administrador'), validateInscripcion, CampeonatoController.inscribirEquipo);

/**
 * @swagger
 * /campeonatos/partidos:
 *   get:
 *     summary: Obtener partidos
 *     tags: [Campeonatos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de partidos
 */
// Partidos
router.get('/partidos', CampeonatoController.getPartidos);

/**
 * @swagger
 * /campeonatos/partidos:
 *   post:
 *     summary: Programar un partido
 *     tags: [Campeonatos]
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
 *               equipo_local_id:
 *                 type: integer
 *               equipo_visitante_id:
 *                 type: integer
 *               fecha_hora:
 *                 type: string
 *                 format: date-time
 *               lugar:
 *                 type: string
 *     responses:
 *       201:
 *         description: Partido creado
 */
router.post('/partidos', verifyRoles('Administrador', 'Entrenador'), validateCreatePartido, CampeonatoController.createPartido);

/**
 * @swagger
 * /campeonatos/partidos/{id}/resultado:
 *   patch:
 *     summary: Actualizar el resultado de un partido
 *     tags: [Campeonatos]
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
 *               goles_local:
 *                 type: integer
 *               goles_visitante:
 *                 type: integer
 *               estado:
 *                 type: string
 *                 enum: [programado, en_juego, finalizado, suspendido]
 *     responses:
 *       200:
 *         description: Resultado actualizado
 */
router.patch('/partidos/:id/resultado', verifyRoles('Administrador', 'Entrenador'), validateUpdateResultado, CampeonatoController.updateResultadoPartido);

export default router;
