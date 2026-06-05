import db from '../config/db.js';

class JugadorModel {
    static async findAll({ page = 1, limit = 10, search = '', categoria_id = null }) {
        const offset = (page - 1) * limit;
        let query = `
            SELECT p.*, u.nombre, u.apellido, u.email, u.estado, c.nombre as categoria_nombre 
            FROM perfil_jugadores p 
            JOIN usuarios u ON p.usuario_id = u.id 
            JOIN categorias c ON p.categoria_id = c.id 
            WHERE u.estado != 'suspendido'
        `;
        const params = [];

        if (search) {
            query += ` AND (u.nombre LIKE ? OR u.apellido LIKE ? OR p.documento_identidad LIKE ?)`;
            const searchParam = `%${search}%`;
            params.push(searchParam, searchParam, searchParam);
        }

        if (categoria_id) {
            query += ` AND p.categoria_id = ?`;
            params.push(categoria_id);
        }

        query += ` ORDER BY p.usuario_id DESC LIMIT ? OFFSET ?`;
        params.push(limit.toString(), offset.toString());

        const [rows] = await db.execute(query, params);

        let countQuery = `
            SELECT COUNT(*) as total 
            FROM perfil_jugadores p 
            JOIN usuarios u ON p.usuario_id = u.id 
            WHERE u.estado != 'suspendido'
        `;
        const countParams = [];
        if (search) {
            countQuery += ` AND (u.nombre LIKE ? OR u.apellido LIKE ? OR p.documento_identidad LIKE ?)`;
            const searchParam = `%${search}%`;
            countParams.push(searchParam, searchParam, searchParam);
        }
        if (categoria_id) {
            countQuery += ` AND p.categoria_id = ?`;
            countParams.push(categoria_id);
        }

        const [totalRows] = await db.execute(countQuery, countParams);

        return { data: rows, total: totalRows[0].total };
    }

    static async findById(usuario_id) {
        const [rows] = await db.execute(
            `SELECT p.*, u.nombre, u.apellido, u.email, u.telefono, u.estado, c.nombre as categoria_nombre 
             FROM perfil_jugadores p 
             JOIN usuarios u ON p.usuario_id = u.id 
             JOIN categorias c ON p.categoria_id = c.id 
             WHERE p.usuario_id = ?`,
            [usuario_id]
        );
        return rows[0];
    }

    static async create(data, conexion = db) {
        const { 
            usuario_id, categoria_id, fecha_nacimiento, documento_identidad, 
            posicion, pierna_habil, estatura_cm, peso_kg, 
            nombre_acudiente, telefono_acudiente, eps_seguro 
        } = data;

        await conexion.execute(
            `INSERT INTO perfil_jugadores 
            (usuario_id, categoria_id, fecha_nacimiento, documento_identidad, posicion, pierna_habil, estatura_cm, peso_kg, nombre_acudiente, telefono_acudiente, eps_seguro) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [usuario_id, categoria_id, fecha_nacimiento, documento_identidad, posicion, pierna_habil, estatura_cm, peso_kg, nombre_acudiente, telefono_acudiente, eps_seguro]
        );
    }

    static async update(usuario_id, data) {
        const { 
            categoria_id, fecha_nacimiento, documento_identidad, 
            posicion, pierna_habil, estatura_cm, peso_kg, 
            nombre_acudiente, telefono_acudiente, eps_seguro 
        } = data;

        await db.execute(
            `UPDATE perfil_jugadores 
             SET categoria_id = ?, fecha_nacimiento = ?, documento_identidad = ?, posicion = ?, 
                 pierna_habil = ?, estatura_cm = ?, peso_kg = ?, nombre_acudiente = ?, 
                 telefono_acudiente = ?, eps_seguro = ? 
             WHERE usuario_id = ?`,
            [categoria_id, fecha_nacimiento, documento_identidad, posicion, pierna_habil, estatura_cm, peso_kg, nombre_acudiente, telefono_acudiente, eps_seguro, usuario_id]
        );
    }

    static async findByDocumento(documento_identidad) {
        const [rows] = await db.execute(`SELECT * FROM perfil_jugadores WHERE documento_identidad = ?`, [documento_identidad]);
        return rows[0];
    }
}

export default JugadorModel;
