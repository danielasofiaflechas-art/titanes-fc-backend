import EntrenamientoModel from '../models/models.entrenamientos.js';

class EntrenamientoService {
    static async getAllEntrenamientos(queryParams, usuario_request) {
        let { page = 1, limit = 10, search = '', categoria_id = null } = queryParams;
        let entrenador_id = null;

        // Validar acceso según rol
        if (usuario_request.rol === 'Entrenador') {
            entrenador_id = usuario_request.id; // Un entrenador solo ve sus entrenamientos
        } else if (usuario_request.rol === 'Jugador') {
            // Logica adicional para que un jugador solo vea entrenamientos de su categoría. (Se implementará en el find filtrando por asistencias si se desea)
            // Por simplicidad, un jugador requeriría filtros más avanzados, aquí lo limitamos al query params.
        }

        const result = await EntrenamientoModel.findAll({ page, limit, search, categoria_id, entrenador_id });
        return {
            entrenamientos: result.data,
            paginacion: {
                totalRegistros: result.total,
                paginaActual: parseInt(page),
                totalPaginas: Math.ceil(result.total / limit),
                limite: parseInt(limit)
            }
        };
    }

    static async getEntrenamientoById(id, usuario_request) {
        const entrenamiento = await EntrenamientoModel.findById(id);
        if (!entrenamiento) throw { statusCode: 404, message: 'Entrenamiento no encontrado' };

        // Validaciones de seguridad por roles
        if (usuario_request.rol === 'Entrenador' && entrenamiento.entrenador_id !== usuario_request.id) {
            throw { statusCode: 403, message: 'No puedes acceder a entrenamientos de otro entrenador' };
        }

        const asistencia = await EntrenamientoModel.getAsistenciaByEntrenamiento(id);
        return { ...entrenamiento, asistencia };
    }

    static async createEntrenamiento(data, usuario_request) {
        const entrenador_id = usuario_request.rol === 'Entrenador' ? usuario_request.id : data.entrenador_id;
        
        if (!entrenador_id) {
            throw { statusCode: 400, message: 'El ID del entrenador es obligatorio' };
        }

        const insertId = await EntrenamientoModel.create({ ...data, entrenador_id });
        return await EntrenamientoModel.findById(insertId);
    }

    static async updateEntrenamiento(id, data, usuario_request) {
        const entrenamiento = await EntrenamientoModel.findById(id);
        if (!entrenamiento) throw { statusCode: 404, message: 'Entrenamiento no encontrado' };

        if (usuario_request.rol === 'Entrenador' && entrenamiento.entrenador_id !== usuario_request.id) {
            throw { statusCode: 403, message: 'No puedes editar un entrenamiento ajeno' };
        }

        await EntrenamientoModel.update(id, data);
        return await EntrenamientoModel.findById(id);
    }

    static async registerAsistencia(entrenamiento_id, lista_asistencia, usuario_request) {
        const entrenamiento = await EntrenamientoModel.findById(entrenamiento_id);
        if (!entrenamiento) throw { statusCode: 404, message: 'Entrenamiento no encontrado' };

        if (usuario_request.rol === 'Entrenador' && entrenamiento.entrenador_id !== usuario_request.id) {
            throw { statusCode: 403, message: 'No tienes permisos para registrar asistencia de esta sesión' };
        }

        for (let asistencia of lista_asistencia) {
            await EntrenamientoModel.registerAsistencia(
                entrenamiento_id, 
                asistencia.jugador_id, 
                asistencia.estado, 
                asistencia.observacion
            );
        }

        return await EntrenamientoModel.getAsistenciaByEntrenamiento(entrenamiento_id);
    }
}

export default EntrenamientoService;
