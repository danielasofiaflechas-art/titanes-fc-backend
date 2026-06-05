import { Router } from 'express';
import authRoutes from './routes.auth.js';
import usuariosRoutes from './routes.usuarios.js';
import jugadoresRoutes from './routes.jugadores.js';
import entrenadoresRoutes from './routes.entrenadores.js';
import entrenamientosRoutes from './routes.entrenamientos.js';
import planesRoutes from './routes.planes.js';
import rendimientoRoutes from './routes.rendimiento.js';
import campeonatosRoutes from './routes.campeonatos.js';
import finanzasRoutes from './routes.finanzas.js';
import dashboardsRoutes from './routes.dashboards.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/jugadores', jugadoresRoutes);
router.use('/entrenadores', entrenadoresRoutes);
router.use('/entrenamientos', entrenamientosRoutes);
router.use('/planes', planesRoutes);
router.use('/rendimiento', rendimientoRoutes);
router.use('/campeonatos', campeonatosRoutes);
router.use('/finanzas', finanzasRoutes);
router.use('/dashboards', dashboardsRoutes);

export default router;



