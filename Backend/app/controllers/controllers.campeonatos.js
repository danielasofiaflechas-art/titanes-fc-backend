import CampeonatoService from '../services/services.campeonatos.js';

class CampeonatoController {
    // Campeonatos
    static async getCampeonatos(req, res, next) {
        try {
            const data = await CampeonatoService.getCampeonatos(req.query);
            res.status(200).json({ success: true, message: 'Campeonatos obtenidos', data });
        } catch (error) { next(error); }
    }

    static async createCampeonato(req, res, next) {
        try {
            const data = await CampeonatoService.createCampeonato(req.body);
            res.status(201).json({ success: true, message: 'Campeonato creado', data });
        } catch (error) { next(error); }
    }

    // Equipos
    static async getEquipos(req, res, next) {
        try {
            const data = await CampeonatoService.getEquipos(req.query);
            res.status(200).json({ success: true, message: 'Equipos obtenidos', data });
        } catch (error) { next(error); }
    }

    static async createEquipo(req, res, next) {
        try {
            const data = await CampeonatoService.createEquipo(req.body);
            res.status(201).json({ success: true, message: 'Equipo creado', data });
        } catch (error) { next(error); }
    }

    static async inscribirEquipo(req, res, next) {
        try {
            const data = await CampeonatoService.inscribirEquipo(req.body);
            res.status(201).json({ success: true, message: 'Equipo inscrito al campeonato', data });
        } catch (error) { next(error); }
    }

    // Partidos
    static async getPartidos(req, res, next) {
        try {
            const data = await CampeonatoService.getPartidos(req.query);
            res.status(200).json({ success: true, message: 'Partidos obtenidos', data });
        } catch (error) { next(error); }
    }

    static async createPartido(req, res, next) {
        try {
            const data = await CampeonatoService.createPartido(req.body);
            res.status(201).json({ success: true, message: 'Partido programado', data });
        } catch (error) { next(error); }
    }

    static async updateResultadoPartido(req, res, next) {
        try {
            const data = await CampeonatoService.updateResultadoPartido(req.params.id, req.body);
            res.status(200).json({ success: true, message: 'Resultado de partido actualizado', data });
        } catch (error) { next(error); }
    }
}

export default CampeonatoController;
