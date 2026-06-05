import { Router } from 'express';
import JugadorController from '../controllers/controllers.jugadores.js';
import { verifyToken } from '../middlewares/middlewares.auth.js';
import { verifyRoles } from '../middlewares/middlewares.roles.js';
import { validateCreateJugador, validateUpdateJugador, validateId } from '../validators/validators.jugadores.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Jugadores
 *   description: Gestión de perfiles y categorías de jugadores
 */

router.use(verifyToken);

/**
 * @swagger
 * /jugadores:
 *   get:
 *     summary: Obtener lista de jugadores
 *     tags: [Jugadores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de jugadores obtenida exitosamente
 */
// Solo Admin y Entrenador pueden ver a todos o crear
router.get('/', verifyRoles('Administrador', 'Entrenador'), JugadorController.getAll);

/**
 * @swagger
 * /jugadores:
 *   post:
 *     summary: Registrar un nuevo jugador
 *     tags: [Jugadores]
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
 *               - categoria_id
 *             properties:
 *               usuario_id:
 *                 type: integer
 *               categoria_id:
 *                 type: integer
 *               fecha_nacimiento:
 *                 type: string
 *                 format: date
 *               posicion_principal:
 *                 type: string
 *               estatura:
 *                 type: number
 *               peso:
 *                 type: number
 *               pierna_habil:
 *                 type: string
 *     responses:
 *       201:
 *         description: Jugador registrado exitosamente
 */
router.post('/', verifyRoles('Administrador', 'Entrenador'), validateCreateJugador, JugadorController.create);

/**
 * @swagger
 * /jugadores/{id}:
 *   get:
 *     summary: Obtener perfil de un jugador por ID
 *     tags: [Jugadores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del jugador
 *     responses:
 *       200:
 *         description: Datos del jugador
 *       404:
 *         description: Jugador no encontrado
 */
// El propio jugador puede ver su perfil. (Controlado en el Controller)
router.get('/:id', validateId, JugadorController.getById);

/**
 * @swagger
 * /jugadores/{id}:
 *   put:
 *     summary: Actualizar perfil de jugador
 *     tags: [Jugadores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del jugador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoria_id:
 *                 type: integer
 *               fecha_nacimiento:
 *                 type: string
 *               posicion_principal:
 *                 type: string
 *               estatura:
 *                 type: number
 *               peso:
 *                 type: number
 *               pierna_habil:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
 */
// Actualizar solo Admin (podría añadirse permisos específicos luego)
router.put('/:id', verifyRoles('Administrador'), validateUpdateJugador, JugadorController.update);

export default router;
