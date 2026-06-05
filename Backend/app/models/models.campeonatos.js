import db from '../config/db.js';

class CampeonatoModel {
    // --- Campeonatos ---
    static async getCampeonatos({ page = 1, limit = 10, search = '', estado = null }) {
        const offset = (page - 1) * limit;
        let query = `SELECT * FROM campeonatos WHERE 1=1`;
        const params = [];

        if (search) {
            query += ` AND (nombre LIKE ? OR organizador LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
        }

        if (estado) {
            query += ` AND estado = ?`;
            params.push(estado);
        }

        query += ` ORDER BY fecha_inicio DESC LIMIT ? OFFSET ?`;
        params.push(limit.toString(), offset.toString());

        const [rows] = await db.execute(query, params);

        let countQuery = `SELECT COUNT(*) as total FROM campeonatos WHERE 1=1`;
        const countParams = [];
        if (search) { countQuery += ` AND (nombre LIKE ? OR organizador LIKE ?)`; countParams.push(`%${search}%`, `%${search}%`); }
        if (estado) { countQuery += ` AND estado = ?`; countParams.push(estado); }

        const [totalRows] = await db.execute(countQuery, countParams);

        return { data: rows, total: totalRows[0].total };
    }

    static async createCampeonato(data) {
        const { nombre, organizador, temporada_ano, valor_inscripcion, fecha_inicio, fecha_fin, estado } = data;
        const [result] = await db.execute(
            `INSERT INTO campeonatos (nombre, organizador, temporada_ano, valor_inscripcion, fecha_inicio, fecha_fin, estado) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [nombre, organizador, temporada_ano, valor_inscripcion || 0, fecha_inicio, fecha_fin, estado || 'Inscripción']
        );
        return result.insertId;
    }

    // --- Equipos Titanes ---
    static async getEquipos({ categoria_id = null }) {
        let query = `
            SELECT e.*, c.nombre as categoria_nombre 
            FROM equipos_titanes e 
            JOIN categorias c ON e.categoria_id = c.id 
            WHERE 1=1
        `;
        const params = [];
        if (categoria_id) {
            query += ` AND e.categoria_id = ?`;
            params.push(categoria_id);
        }
        query += ` ORDER BY e.nombre_equipo_completo ASC`;
        const [rows] = await db.execute(query, params);
        return rows;
    }

    static async createEquipo(data) {
        const { categoria_id, nombre_equipo_completo, identificacion_unica_club } = data;
        const [result] = await db.execute(
            `INSERT INTO equipos_titanes (categoria_id, nombre_equipo_completo, identificacion_unica_club) 
             VALUES (?, ?, ?)`,
            [categoria_id, nombre_equipo_completo, identificacion_unica_club]
        );
        return result.insertId;
    }

    // --- Inscripción de Equipos a Campeonatos ---
    static async inscribirEquipo(campeonato_id, equipo_titanes_id) {
        await db.execute(
            `INSERT IGNORE INTO campeonato_equipos_inscritos (campeonato_id, equipo_titanes_id) 
             VALUES (?, ?)`,
            [campeonato_id, equipo_titanes_id]
        );
    }

    // --- Partidos ---
    static async getPartidos({ campeonato_id = null, equipo_titanes_id = null, limit = null }) {
        let query = `
            SELECT p.*, c.nombre as campeonato_nombre, e.nombre_equipo_completo 
            FROM partidos_programacion p 
            JOIN campeonatos c ON p.campeonato_id = c.id 
            JOIN equipos_titanes e ON p.equipo_titanes_id = e.id 
            WHERE 1=1
        `;
        const params = [];
        
        if (campeonato_id) { query += ` AND p.campeonato_id = ?`; params.push(campeonato_id); }
        if (equipo_titanes_id) { query += ` AND p.equipo_titanes_id = ?`; params.push(equipo_titanes_id); }

        query += ` ORDER BY p.fecha_hora_partido DESC`;
        
        if (limit) {
            query += ` LIMIT ?`;
            params.push(limit.toString());
        }

        const [rows] = await db.execute(query, params);
        return rows;
    }

    static async createPartido(data) {
        const { campeonato_id, equipo_titanes_id, rival_nombre, fase_campeonato, fecha_hora_partido, lugar_cancha } = data;
        const [result] = await db.execute(
            `INSERT INTO partidos_programacion (campeonato_id, equipo_titanes_id, rival_nombre, fase_campeonato, fecha_hora_partido, lugar_cancha) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [campeonato_id, equipo_titanes_id, rival_nombre, fase_campeonato, fecha_hora_partido, lugar_cancha]
        );
        return result.insertId;
    }

    static async updateResultadoPartido(id, goles_titanes, goles_rival, resultado_final) {
        await db.execute(
            `UPDATE partidos_programacion SET goles_titanes = ?, goles_rival = ?, resultado_final = ? WHERE id = ?`,
            [goles_titanes, goles_rival, resultado_final, id]
        );
    }
}

export default CampeonatoModel;
