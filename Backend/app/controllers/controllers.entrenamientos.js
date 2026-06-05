import EntrenamientoService from '../services/services.entrenamientos.js';

class EntrenamientoController {
    static async getAll(req, res, next) {
        try {
            const data = await EntrenamientoService.getAllEntrenamientos(req.query, req.usuario);
            res.status(200).json({ success: true, message: 'Entrenamientos obtenidos', data });
        } catch (error) { next(error); }
    }

    static async getById(req, res, next) {
        try {
            const data = await EntrenamientoService.getEntrenamientoById(req.params.id, req.usuario);
            res.status(200).json({ success: true, message: 'Entrenamiento encontrado', data });
        } catch (error) { next(error); }
    }

    static async create(req, res, next) {
        try {
            const data = await EntrenamientoService.createEntrenamiento(req.body, req.usuario);
            res.status(201).json({ success: true, message: 'Entrenamiento programado con éxito', data });
        } catch (error) { next(error); }
    }

    static async update(req, res, next) {
        try {
            const data = await EntrenamientoService.updateEntrenamiento(req.params.id, req.body, req.usuario);
            res.status(200).json({ success: true, message: 'Entrenamiento actualizado', data });
        } catch (error) { next(error); }
    }

    static async registerAsistencia(req, res, next) {
        try {
            const data = await EntrenamientoService.registerAsistencia(req.params.id, req.body.asistencia, req.usuario);
            res.status(200).json({ success: true, message: 'Asistencia registrada correctamente', data });
        } catch (error) { next(error); }
    }
}

export default EntrenamientoController;
