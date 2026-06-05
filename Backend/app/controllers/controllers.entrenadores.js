import EntrenadorService from '../services/services.entrenadores.js';

class EntrenadorController {
    static async getAll(req, res, next) {
        try {
            const data = await EntrenadorService.getAllEntrenadores(req.query);
            res.status(200).json({ success: true, message: 'Entrenadores obtenidos', data });
        } catch (error) { next(error); }
    }

    static async getById(req, res, next) {
        try {
            const data = await EntrenadorService.getEntrenadorById(req.params.id);
            res.status(200).json({ success: true, message: 'Entrenador encontrado', data });
        } catch (error) { next(error); }
    }

    static async create(req, res, next) {
        try {
            const data = await EntrenadorService.createEntrenador(req.body);
            res.status(201).json({ success: true, message: 'Entrenador creado exitosamente', data });
        } catch (error) { next(error); }
    }

    static async update(req, res, next) {
        try {
            const data = await EntrenadorService.updateEntrenador(req.params.id, req.body);
            res.status(200).json({ success: true, message: 'Entrenador actualizado', data });
        } catch (error) { next(error); }
    }
}

export default EntrenadorController;
