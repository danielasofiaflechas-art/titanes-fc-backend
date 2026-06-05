import CampeonatoModel from '../models/models.campeonatos.js';
import db from '../config/db.js';

class CampeonatoService {
    static async getCampeonatos(queryParams) {
        const page = parseInt(queryParams.page) || 1;
        const limit = parseInt(queryParams.limit) || 10;
        const search = queryParams.search || '';
        const estado = queryParams.estado || null;

        const result = await CampeonatoModel.getCampeonatos({ page, limit, search, estado });
        return {
            campeonatos: result.data,
            paginacion: {
                totalRegistros: result.total,
                paginaActual: page,
                totalPaginas: Math.ceil(result.total / limit),
                limite: limit
            }
        };
    }

    static async createCampeonato(data) {
        const id = await CampeonatoModel.createCampeonato(data);
        return { id, ...data };
    }

    static async getEquipos(queryParams) {
        return await CampeonatoModel.getEquipos({ categoria_id: queryParams.categoria_id });
    }

    static async createEquipo(data) {
        const id = await CampeonatoModel.createEquipo(data);
        return { id, ...data };
    }

    static async inscribirEquipo(data) {
        const connection = await db.getConnection();
        await connection.beginTransaction();
        try {
            // Verificar que el campeonato existe
            const [campeonato] = await connection.execute(
                'SELECT id FROM campeonatos WHERE id = ?',
                [data.campeonato_id]
            );
            if (!campeonato || campeonato.length === 0) {
                throw { statusCode: 404, message: 'Campeonato no encontrado' };
            }

            // Verificar que el equipo existe
            const [equipo] = await connection.execute(
                'SELECT id FROM equipos_titanes WHERE id = ?',
                [data.equipo_titanes_id]
            );
            if (!equipo || equipo.length === 0) {
                throw { statusCode: 404, message: 'Equipo no encontrado' };
            }

            // Inscribir equipo a campeonato
            await connection.execute(
                'INSERT IGNORE INTO campeonato_equipos_inscritos (campeonato_id, equipo_titanes_id) VALUES (?, ?)',
                [data.campeonato_id, data.equipo_titanes_id]
            );

            await connection.commit();
            return data;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getPartidos(queryParams) {
        return await CampeonatoModel.getPartidos(queryParams);
    }

    static async createPartido(data) {
        const id = await CampeonatoModel.createPartido(data);
        return { id, ...data, resultado_final: 'Por Jugar' };
    }

    static async updateResultadoPartido(id, data) {
        await CampeonatoModel.updateResultadoPartido(id, data.goles_titanes, data.goles_rival, data.resultado_final);
        return { id, ...data };
    }
}

export default CampeonatoService;
