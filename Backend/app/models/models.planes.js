import db from '../config/db.js';

class PlanModel {
    // --- Ejercicios ---
    static async getEjercicios({ search = '' }) {
        let query = `SELECT * FROM ejercicios WHERE 1=1`;
        const params = [];
        if (search) {
            query += ` AND (nombre LIKE ? OR grupo_muscular_cualidad LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
        }
        query += ` ORDER BY nombre ASC`;
        const [rows] = await db.execute(query, params);
        return rows;
    }

    static async createEjercicio(data) {
        const { nombre, descripcion, grupo_muscular_cualidad, url_video_ejemplo } = data;
        const [result] = await db.execute(
            `INSERT INTO ejercicios (nombre, descripcion, grupo_muscular_cualidad, url_video_ejemplo) VALUES (?, ?, ?, ?)`,
            [nombre, descripcion, grupo_muscular_cualidad, url_video_ejemplo || null]
        );
        return result.insertId;
    }

    // --- Planes de Entrenamiento ---
    static async getPlanes({ page = 1, limit = 10, entrenador_id = null }) {
        const offset = (page - 1) * limit;
        let query = `
            SELECT p.*, CONCAT(u.nombre, ' ', u.apellido) as entrenador_nombre 
            FROM planes_entrenamiento p 
            JOIN usuarios u ON p.entrenador_id = u.id 
            WHERE 1=1
        `;
        const params = [];

        if (entrenador_id) {
            query += ` AND p.entrenador_id = ?`;
            params.push(entrenador_id);
        }

        query += ` ORDER BY p.fecha_inicio DESC LIMIT ? OFFSET ?`;
        params.push(limit.toString(), offset.toString());

        const [rows] = await db.execute(query, params);

        let countQuery = `SELECT COUNT(*) as total FROM planes_entrenamiento WHERE 1=1`;
        const countParams = [];
        if (entrenador_id) { countQuery += ` AND entrenador_id = ?`; countParams.push(entrenador_id); }
        const [totalRows] = await db.execute(countQuery, countParams);

        return { data: rows, total: totalRows[0].total };
    }

    static async getPlanById(id) {
        const [rows] = await db.execute(`
            SELECT p.*, CONCAT(u.nombre, ' ', u.apellido) as entrenador_nombre 
            FROM planes_entrenamiento p 
            JOIN usuarios u ON p.entrenador_id = u.id 
            WHERE p.id = ?
        `, [id]);
        
        if (rows[0]) {
            // Cargar ejercicios del plan
            const [ejercicios] = await db.execute(`
                SELECT e.nombre, e.grupo_muscular_cualidad, ped.* 
                FROM plan_ejercicio_detalle ped 
                JOIN ejercicios e ON ped.ejercicio_id = e.id 
                WHERE ped.plan_id = ?
            `, [id]);
            rows[0].ejercicios = ejercicios;

            // Cargar jugadores asignados
            const [jugadores] = await db.execute(`
                SELECT paj.*, u.nombre, u.apellido 
                FROM plan_asignacion_jugador paj 
                JOIN perfil_jugadores pj ON paj.jugador_id = pj.usuario_id 
                JOIN usuarios u ON pj.usuario_id = u.id 
                WHERE paj.plan_id = ?
            `, [id]);
            rows[0].jugadores_asignados = jugadores;
        }

        return rows[0];
    }

    static async createPlan(data, conexion = db) {
        const { entrenador_id, nombre_plan, descripcion, fecha_inicio, fecha_fin } = data;
        const [result] = await conexion.execute(
            `INSERT INTO planes_entrenamiento (entrenador_id, nombre_plan, descripcion, fecha_inicio, fecha_fin) 
             VALUES (?, ?, ?, ?, ?)`,
            [entrenador_id, nombre_plan, descripcion || null, fecha_inicio, fecha_fin]
        );
        return result.insertId;
    }

    static async assignEjercicioToPlan(plan_id, data, conexion = db) {
        const { ejercicio_id, series, repeticiones, duracion_minutos, descanso_segundos } = data;
        await conexion.execute(
            `INSERT INTO plan_ejercicio_detalle (plan_id, ejercicio_id, series, repeticiones, duracion_minutos, descanso_segundos) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [plan_id, ejercicio_id, series, repeticiones || null, duracion_minutos || null, descanso_segundos || null]
        );
    }

    static async assignPlanToJugador(plan_id, jugador_id, conexion = db) {
        await conexion.execute(
            `INSERT IGNORE INTO plan_asignacion_jugador (plan_id, jugador_id, fecha_asignacion) 
             VALUES (?, ?, CURDATE())`,
            [plan_id, jugador_id]
        );
    }

    static async updateEstadoPlanJugador(plan_id, jugador_id, estado) {
        await db.execute(
            `UPDATE plan_asignacion_jugador SET estado = ? WHERE plan_id = ? AND jugador_id = ?`,
            [estado, plan_id, jugador_id]
        );
    }
}

export default PlanModel;
