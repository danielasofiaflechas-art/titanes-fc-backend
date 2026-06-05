import PlanModel from '../models/models.planes.js';
import db from '../config/db.js';

class PlanService {
    // --- Ejercicios ---
    static async getEjercicios(search) {
        return await PlanModel.getEjercicios({ search });
    }

    static async createEjercicio(data) {
        const id = await PlanModel.createEjercicio(data);
        return { id, ...data };
    }

    // --- Planes ---
    static async getPlanes(queryParams, usuario_request) {
        let { page = 1, limit = 10 } = queryParams;
        let entrenador_id = null;

        if (usuario_request.rol === 'Entrenador') {
            entrenador_id = usuario_request.id;
        }

        const result = await PlanModel.getPlanes({ page, limit, entrenador_id });
        return {
            planes: result.data,
            paginacion: {
                totalRegistros: result.total,
                paginaActual: parseInt(page),
                totalPaginas: Math.ceil(result.total / limit),
                limite: parseInt(limit)
            }
        };
    }

    static async getPlanById(id, usuario_request) {
        const plan = await PlanModel.getPlanById(id);
        if (!plan) throw { statusCode: 404, message: 'Plan no encontrado' };

        if (usuario_request.rol === 'Entrenador' && plan.entrenador_id !== usuario_request.id) {
            throw { statusCode: 403, message: 'No puedes ver el plan de otro entrenador' };
        }

        // Si es jugador, validar que esté asignado
        if (usuario_request.rol === 'Jugador') {
            const isAssigned = plan.jugadores_asignados.some(j => j.jugador_id === usuario_request.id);
            if (!isAssigned) throw { statusCode: 403, message: 'No tienes acceso a este plan' };
        }

        return plan;
    }

    static async createPlan(data, usuario_request) {
        const entrenador_id = usuario_request.rol === 'Entrenador' ? usuario_request.id : data.entrenador_id;
        if (!entrenador_id) throw { statusCode: 400, message: 'Se requiere ID del entrenador' };

        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // Crear el plan base
            const plan_id = await PlanModel.createPlan({ ...data, entrenador_id }, connection);

            // Asignar ejercicios
            if (data.ejercicios && Array.isArray(data.ejercicios)) {
                for (let ej of data.ejercicios) {
                    await PlanModel.assignEjercicioToPlan(plan_id, ej, connection);
                }
            }

            // Asignar jugadores
            if (data.jugadores && Array.isArray(data.jugadores)) {
                for (let j_id of data.jugadores) {
                    await PlanModel.assignPlanToJugador(plan_id, j_id, connection);
                }
            }

            await connection.commit();
            return await PlanModel.getPlanById(plan_id);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async updateEstadoPlanJugador(plan_id, estado, usuario_request) {
        if (usuario_request.rol !== 'Jugador') {
            throw { statusCode: 403, message: 'Solo el jugador puede cambiar el estado de su plan' };
        }

        await PlanModel.updateEstadoPlanJugador(plan_id, usuario_request.id, estado);
        return { plan_id, jugador_id: usuario_request.id, estado };
    }
}

export default PlanService;
