import RendimientoModel from '../models/models.rendimiento.js';

class RendimientoService {
    // --- Test Configuración ---
    static async getTestsConfig() {
        return await RendimientoModel.getTestsConfig();
    }

    static async createTestConfig(data) {
        const id = await RendimientoModel.createTestConfig(data);
        return { id, ...data };
    }

    // --- Resultados y Evaluaciones ---
    static async registerTestResultado(data, usuario_request) {
        const entrenador_id = usuario_request.rol === 'Entrenador' ? usuario_request.id : data.entrenador_id;
        if (!entrenador_id) throw { statusCode: 400, message: 'Se requiere ID del entrenador' };

        const id = await RendimientoModel.registerTestResultado({ ...data, entrenador_id });
        return { id, ...data, entrenador_id };
    }

    static async getResultadosTestJugador(jugador_id, usuario_request) {
        if (usuario_request.rol === 'Jugador' && usuario_request.id !== parseInt(jugador_id)) {
            throw { statusCode: 403, message: 'Solo puedes ver tus propios resultados' };
        }
        return await RendimientoModel.getResultadosTestJugador(jugador_id);
    }

    static async registerEvaluacionPeriodica(data, usuario_request) {
        const entrenador_id = usuario_request.rol === 'Entrenador' ? usuario_request.id : data.entrenador_id;
        if (!entrenador_id) throw { statusCode: 400, message: 'Se requiere ID del entrenador' };

        const id = await RendimientoModel.registerEvaluacionPeriodica({ ...data, entrenador_id });
        return { id, ...data, entrenador_id };
    }

    static async getDashboardDeportivo(jugador_id, usuario_request) {
        if (usuario_request.rol === 'Jugador' && usuario_request.id !== parseInt(jugador_id)) {
            throw { statusCode: 403, message: 'Solo puedes ver tu propio dashboard' };
        }

        const evaluaciones = await RendimientoModel.getEvaluacionesJugador(jugador_id);
        const testResultados = await RendimientoModel.getResultadosTestJugador(jugador_id);
        const resumenGlobal = await RendimientoModel.getDashboardJugador(jugador_id);

        return {
            jugador_id,
            resumen_global: resumenGlobal,
            evolucion_graficas: evaluaciones, // Listo para graficar en frontend
            ultimos_test: testResultados.slice(0, 5) // Top 5 recientes
        };
    }
}

export default RendimientoService;
