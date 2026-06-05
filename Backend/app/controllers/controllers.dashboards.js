import DashboardService from '../services/services.dashboards.js';

class DashboardController {
    static async getDashboard(req, res, next) {
        try {
            const data = await DashboardService.getDashboard(req.usuario);
            res.status(200).json({ success: true, message: `Dashboard de ${req.usuario.rol} cargado`, data });
        } catch (error) { next(error); }
    }
}

export default DashboardController;
