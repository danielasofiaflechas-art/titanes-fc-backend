import JugadorService from '../services/services.jugadores.js';

class JugadorController {
    static async getAll(req, res, next) {
        try {
            const data = await JugadorService.getAllJugadores(req.query);
            res.status(200).json({ success: true, message: 'Jugadores obtenidos', data });
        } catch (error) { next(error); }
    }

    static async getById(req, res, next) {
        try {
            // Si el rol es jugador, validar que solo pueda verse a sí mismo (a menos que tenga permisos admin/entrenador)
            if (req.usuario.rol === 'Jugador' && req.usuario.id !== parseInt(req.params.id)) {
                return res.status(403).json({ success: false, message: 'Acceso denegado a este perfil' });
            }

            const data = await JugadorService.getJugadorById(req.params.id);
            res.status(200).json({ success: true, message: 'Jugador encontrado', data });
        } catch (error) { next(error); }
    }

    static async create(req, res, next) {
        try {
            const data = await JugadorService.createJugador(req.body);
            res.status(201).json({ success: true, message: 'Jugador creado exitosamente', data });
        } catch (error) { next(error); }
    }

    static async update(req, res, next) {
        try {
            const data = await JugadorService.updateJugador(req.params.id, req.body);
            res.status(200).json({ success: true, message: 'Jugador actualizado', data });
        } catch (error) { next(error); }
    }
}

export default JugadorController;
