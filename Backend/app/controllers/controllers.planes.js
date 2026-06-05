import PlanService from '../services/services.planes.js';

class PlanController {
    // Ejercicios
    static async getEjercicios(req, res, next) {
        try {
            const data = await PlanService.getEjercicios(req.query.search);
            res.status(200).json({ success: true, message: 'Ejercicios obtenidos', data });
        } catch (error) { next(error); }
    }

    static async createEjercicio(req, res, next) {
        try {
            const data = await PlanService.createEjercicio(req.body);
            res.status(201).json({ success: true, message: 'Ejercicio creado', data });
        } catch (error) { next(error); }
    }

    // Planes
    static async getPlanes(req, res, next) {
        try {
            const data = await PlanService.getPlanes(req.query, req.usuario);
            res.status(200).json({ success: true, message: 'Planes de entrenamiento obtenidos', data });
        } catch (error) { next(error); }
    }

    static async getPlanById(req, res, next) {
        try {
            const data = await PlanService.getPlanById(req.params.id, req.usuario);
            res.status(200).json({ success: true, message: 'Plan de entrenamiento encontrado', data });
        } catch (error) { next(error); }
    }

    static async createPlan(req, res, next) {
        try {
            const data = await PlanService.createPlan(req.body, req.usuario);
            res.status(201).json({ success: true, message: 'Plan de entrenamiento creado', data });
        } catch (error) { next(error); }
    }

    static async updateEstadoPlanJugador(req, res, next) {
        try {
            const data = await PlanService.updateEstadoPlanJugador(req.params.id, req.body.estado, req.usuario);
            res.status(200).json({ success: true, message: 'Estado del plan actualizado', data });
        } catch (error) { next(error); }
    }
}

export default PlanController;
