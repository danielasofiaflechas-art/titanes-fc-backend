import RendimientoService from '../services/services.rendimiento.js';

class RendimientoController {
    // --- Configuración Tests ---
    static async getTestsConfig(req, res, next) {
        try {
            const data = await RendimientoService.getTestsConfig();
            res.status(200).json({ success: true, message: 'Configuración de tests obtenida', data });
        } catch (error) { next(error); }
    }

    static async createTestConfig(req, res, next) {
        try {
            const data = await RendimientoService.createTestConfig(req.body);
            res.status(201).json({ success: true, message: 'Test creado', data });
        } catch (error) { next(error); }
    }

    // --- Resultados ---
    static async registerTestResultado(req, res, next) {
        try {
            const data = await RendimientoService.registerTestResultado(req.body, req.usuario);
            res.status(201).json({ success: true, message: 'Resultado de test registrado', data });
        } catch (error) { next(error); }
    }

    static async registerEvaluacionPeriodica(req, res, next) {
        try {
            const data = await RendimientoService.registerEvaluacionPeriodica(req.body, req.usuario);
            res.status(201).json({ success: true, message: 'Evaluación periódica registrada', data });
        } catch (error) { next(error); }
    }

    // --- Dashboards y Consultas Jugador ---
    static async getDashboardJugador(req, res, next) {
        try {
            const data = await RendimientoService.getDashboardDeportivo(req.params.id, req.usuario);
            res.status(200).json({ success: true, message: 'Dashboard deportivo obtenido', data });
        } catch (error) { next(error); }
    }
}

export default RendimientoController;
