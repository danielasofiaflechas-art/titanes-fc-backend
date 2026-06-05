import db from '../config/db.js';

class EntrenadorModel {
    static async findAll({ page = 1, limit = 10, search = '' }) {
        const offset = (page - 1) * limit;
        let query = `
            SELECT p.*, u.nombre, u.apellido, u.email, u.estado 
            FROM perfil_entrenadores p 
            JOIN usuarios u ON p.usuario_id = u.id 
            WHERE u.estado != 'suspendido'
        `;
        const params = [];

        if (search) {
            query += ` AND (u.nombre LIKE ? OR u.apellido LIKE ? OR p.licencia LIKE ?)`;
            const searchParam = `%${search}%`;
            params.push(searchParam, searchParam, searchParam);
        }

        query += ` ORDER BY p.usuario_id DESC LIMIT ? OFFSET ?`;
        params.push(limit.toString(), offset.toString());

        const [rows] = await db.execute(query, params);

        let countQuery = `
            SELECT COUNT(*) as total 
            FROM perfil_entrenadores p 
            JOIN usuarios u ON p.usuario_id = u.id 
            WHERE u.estado != 'suspendido'
        `;
        const countParams = [];
        if (search) {
            countQuery += ` AND (u.nombre LIKE ? OR u.apellido LIKE ? OR p.licencia LIKE ?)`;
            const searchParam = `%${search}%`;
            countParams.push(searchParam, searchParam, searchParam);
        }
        const [totalRows] = await db.execute(countQuery, countParams);

        return { data: rows, total: totalRows[0].total };
    }

    static async findById(usuario_id) {
        const [rows] = await db.execute(
            `SELECT p.*, u.nombre, u.apellido, u.email, u.telefono, u.estado 
             FROM perfil_entrenadores p 
             JOIN usuarios u ON p.usuario_id = u.id 
             WHERE p.usuario_id = ?`,
            [usuario_id]
        );
        
        if(rows[0]) {
            // Cargar categorías asignadas
            const [catRows] = await db.execute(
                `SELECT c.id, c.nombre FROM categoria_entrenador ce JOIN categorias c ON ce.categoria_id = c.id WHERE ce.entrenador_id = ?`,
                [usuario_id]
            );
            rows[0].categorias_asignadas = catRows;
        }

        return rows[0];
    }

    static async create(data, conexion = db) {
        const { usuario_id, licencia, especialidad, experiencia_anos } = data;
        await conexion.execute(
            `INSERT INTO perfil_entrenadores (usuario_id, licencia, especialidad, experiencia_anos) 
             VALUES (?, ?, ?, ?)`,
            [usuario_id, licencia, especialidad, experiencia_anos]
        );
    }

    static async assignCategoria(entrenador_id, categoria_id, conexion = db) {
        await conexion.execute(
            `INSERT IGNORE INTO categoria_entrenador (entrenador_id, categoria_id) VALUES (?, ?)`,
            [entrenador_id, categoria_id]
        );
    }

    static async clearCategorias(entrenador_id, conexion = db) {
        await conexion.execute(`DELETE FROM categoria_entrenador WHERE entrenador_id = ?`, [entrenador_id]);
    }

    static async update(usuario_id, data) {
        const { licencia, especialidad, experiencia_anos } = data;
        await db.execute(
            `UPDATE perfil_entrenadores SET licencia = ?, especialidad = ?, experiencia_anos = ? WHERE usuario_id = ?`,
            [licencia, especialidad, experiencia_anos, usuario_id]
        );
    }
}

export default EntrenadorModel;
