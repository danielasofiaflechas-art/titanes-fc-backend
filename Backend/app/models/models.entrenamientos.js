import db from '../config/db.js';

class EntrenamientoModel {
    static async findAll({ page = 1, limit = 10, search = '', categoria_id = null, entrenador_id = null }) {
        const offset = (page - 1) * limit;
        let query = `
            SELECT ep.*, c.nombre as categoria_nombre, 
                   CONCAT(u.nombre, ' ', u.apellido) as entrenador_nombre 
            FROM entrenamientos_programacion ep 
            JOIN categorias c ON ep.categoria_id = c.id 
            JOIN usuarios u ON ep.entrenador_id = u.id 
            WHERE 1=1
        `;
        const params = [];

        if (search) {
            query += ` AND (ep.objetivo_sesion LIKE ? OR ep.lugar LIKE ?)`;
            const searchParam = `%${search}%`;
            params.push(searchParam, searchParam);
        }

        if (categoria_id) {
            query += ` AND ep.categoria_id = ?`;
            params.push(categoria_id);
        }

        if (entrenador_id) {
            query += ` AND ep.entrenador_id = ?`;
            params.push(entrenador_id);
        }

        query += ` ORDER BY ep.fecha_hora DESC LIMIT ? OFFSET ?`;
        params.push(limit.toString(), offset.toString());

        const [rows] = await db.execute(query, params);

        let countQuery = `SELECT COUNT(*) as total FROM entrenamientos_programacion ep WHERE 1=1`;
        const countParams = [];
        if (search) { countQuery += ` AND (ep.objetivo_sesion LIKE ? OR ep.lugar LIKE ?)`; countParams.push(`%${search}%`, `%${search}%`); }
        if (categoria_id) { countQuery += ` AND ep.categoria_id = ?`; countParams.push(categoria_id); }
        if (entrenador_id) { countQuery += ` AND ep.entrenador_id = ?`; countParams.push(entrenador_id); }

        const [totalRows] = await db.execute(countQuery, countParams);

        return { data: rows, total: totalRows[0].total };
    }

    static async findById(id) {
        const [rows] = await db.execute(`
            SELECT ep.*, c.nombre as categoria_nombre, CONCAT(u.nombre, ' ', u.apellido) as entrenador_nombre 
            FROM entrenamientos_programacion ep 
            JOIN categorias c ON ep.categoria_id = c.id 
            JOIN usuarios u ON ep.entrenador_id = u.id 
            WHERE ep.id = ?
        `, [id]);
        return rows[0];
    }

    static async create(data) {
        const { categoria_id, entrenador_id, fecha_hora, lugar, objetivo_sesion, observaciones_generales } = data;
        const [result] = await db.execute(
            `INSERT INTO entrenamientos_programacion (categoria_id, entrenador_id, fecha_hora, lugar, objetivo_sesion, observaciones_generales) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [categoria_id, entrenador_id, fecha_hora, lugar, objetivo_sesion, observaciones_generales || null]
        );
        return result.insertId;
    }

    static async update(id, data) {
        const { fecha_hora, lugar, objetivo_sesion, observaciones_generales } = data;
        await db.execute(
            `UPDATE entrenamientos_programacion 
             SET fecha_hora = ?, lugar = ?, objetivo_sesion = ?, observaciones_generales = ? 
             WHERE id = ?`,
            [fecha_hora, lugar, objetivo_sesion, observaciones_generales || null, id]
        );
    }

    static async registerAsistencia(entrenamiento_id, jugador_id, estado, observacion) {
        await db.execute(
            `INSERT INTO asistencia_entrenamientos (entrenamiento_id, jugador_id, estado, observacion) 
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE estado = VALUES(estado), observacion = VALUES(observacion)`,
            [entrenamiento_id, jugador_id, estado, observacion || null]
        );
    }

    static async getAsistenciaByEntrenamiento(entrenamiento_id) {
        const [rows] = await db.execute(`
            SELECT a.*, u.nombre, u.apellido, p.documento_identidad 
            FROM asistencia_entrenamientos a 
            JOIN perfil_jugadores p ON a.jugador_id = p.usuario_id 
            JOIN usuarios u ON p.usuario_id = u.id 
            WHERE a.entrenamiento_id = ?
        `, [entrenamiento_id]);
        return rows;
    }

    static async getEstadisticasAsistenciaJugador(jugador_id) {
        const [rows] = await db.execute(`
            SELECT estado, COUNT(*) as cantidad 
            FROM asistencia_entrenamientos 
            WHERE jugador_id = ? 
            GROUP BY estado
        `, [jugador_id]);
        return rows;
    }
}

export default EntrenamientoModel;
