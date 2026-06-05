import DashboardModel from '../models/models.dashboards.js';

class DashboardService {
    static async getDashboard(usuario_request) {
        if (usuario_request.rol === 'Administrador') {
            return await DashboardModel.getAdminStats();
        } else if (usuario_request.rol === 'Entrenador') {
            return await DashboardModel.getEntrenadorStats(usuario_request.id);
        } else if (usuario_request.rol === 'Jugador') {
            return await DashboardModel.getJugadorStats(usuario_request.id);
        } else {
            throw { statusCode: 403, message: 'Rol no válido para obtener dashboard general' };
        }
    }
}

export default DashboardService;
