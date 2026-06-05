import FinanzasService from '../services/services.finanzas.js';

class FinanzasController {
    static async getMensualidades(req, res, next) {
        try {
            const data = await FinanzasService.getMensualidades(req.query, req.usuario);
            res.status(200).json({ success: true, message: 'Mensualidades obtenidas', data });
        } catch (error) { next(error); }
    }

    static async generarMensualidadesLote(req, res, next) {
        try {
            const count = await FinanzasService.generarMensualidadesLote(req.body);
            res.status(201).json({ success: true, message: `Generadas ${count} mensualidades` });
        } catch (error) { next(error); }
    }

    static async pagarMensualidad(req, res, next) {
        try {
            const data = await FinanzasService.pagarMensualidad(req.params.id, req.body);
            res.status(200).json({ success: true, message: 'Pago registrado correctamente', data });
        } catch (error) { next(error); }
    }

    static async getInscripciones(req, res, next) {
        try {
            const data = await FinanzasService.getInscripciones();
            res.status(200).json({ success: true, message: 'Inscripciones obtenidas', data });
        } catch (error) { next(error); }
    }

    static async registrarInscripcion(req, res, next) {
        try {
            const data = await FinanzasService.registrarInscripcion(req.body);
            res.status(201).json({ success: true, message: 'Inscripción registrada', data });
        } catch (error) { next(error); }
    }

    static async getHistorial(req, res, next) {
        try {
            const data = await FinanzasService.getHistorialTransacciones(req.query);
            res.status(200).json({ success: true, message: 'Historial de caja obtenido', data });
        } catch (error) { next(error); }
    }
}

export default FinanzasController;
