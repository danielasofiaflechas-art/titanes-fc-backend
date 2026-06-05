import { Router } from 'express';
import DashboardController from '../controllers/controllers.dashboards.js';
import { verifyToken } from '../middlewares/middlewares.auth.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Dashboards
 *   description: Obtención de métricas y estadísticas para cada rol
 */

router.use(verifyToken);
/**
 * @swagger
 * /dashboards/home:
 *   get:
 *     summary: Obtener el dashboard principal según el rol del usuario
 *     tags: [Dashboards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos estadísticos para el home del usuario
 */
router.get('/home', DashboardController.getDashboard);

export default router;
