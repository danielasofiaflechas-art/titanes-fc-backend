import db from '../config/db.js';

class UsuarioModel {
    static async findAll({ page = 1, limit = 10, search = '' }) {
        const offset = (page - 1) * limit;
        let query = `
            SELECT u.id, u.nombre, u.apellido, u.email, u.telefono, u.estado, u.ultimo_acceso, r.nombre as rol_nombre 
            FROM usuarios u 
            JOIN roles r ON u.rol_id = r.id 
            WHERE 1=1
        `;
        const params = [];

        if (search) {
            query += ` AND (u.nombre LIKE ? OR u.apellido LIKE ? OR u.email LIKE ?)`;
            const searchParam = `%${search}%`;
            params.push(searchParam, searchParam, searchParam);
        }

        query += ` ORDER BY u.id DESC LIMIT ? OFFSET ?`;
        // Convert to string to avoid MySQL parameter stringification issues with LIMIT
        params.push(limit.toString(), offset.toString());

        const [rows] = await db.execute(query, params);

        // Contar totales para paginación
        let countQuery = `SELECT COUNT(*) as total FROM usuarios u WHERE 1=1`;
        const countParams = [];
        if (search) {
            countQuery += ` AND (u.nombre LIKE ? OR u.apellido LIKE ? OR u.email LIKE ?)`;
            const searchParam = `%${search}%`;
            countParams.push(searchParam, searchParam, searchParam);
        }
        const [totalRows] = await db.execute(countQuery, countParams);

        return { data: rows, total: totalRows[0].total };
    }

    static async findByEmail(email) {
        const [rows] = await db.execute(
            `SELECT u.*, r.nombre as rol_nombre FROM usuarios u JOIN roles r ON u.rol_id = r.id WHERE u.email = ?`, 
            [email]
        );
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.execute(
            `SELECT u.id, u.nombre, u.apellido, u.email, u.telefono, u.estado, u.ultimo_acceso, u.rol_id, r.nombre as rol_nombre 
             FROM usuarios u JOIN roles r ON u.rol_id = r.id WHERE u.id = ?`, 
            [id]
        );
        return rows[0];
    }

    static async create(data) {
        const { rol_id, nombre, apellido, email, password, telefono, estado = 'activo' } = data;
        const [result] = await db.execute(
            `INSERT INTO usuarios (rol_id, nombre, apellido, email, password, telefono, estado) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [rol_id, nombre, apellido, email, password, telefono, estado]
        );
        return result.insertId;
    }

    static async update(id, data) {
        const { rol_id, nombre, apellido, telefono, estado } = data;
        await db.execute(
            `UPDATE usuarios SET rol_id = ?, nombre = ?, apellido = ?, telefono = ?, estado = ? WHERE id = ?`,
            [rol_id, nombre, apellido, telefono, estado, id]
        );
    }

    static async updatePassword(id, hashedPassword) {
        await db.execute(`UPDATE usuarios SET password = ? WHERE id = ?`, [hashedPassword, id]);
    }

    static async delete(id) {
        // Soft delete para mantener integridad referencial
        await db.execute(`UPDATE usuarios SET estado = 'suspendido' WHERE id = ?`, [id]);
    }

    static async updateUltimoAcceso(id) {
        await db.execute('UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = ?', [id]);
    }

    static async getPermisos(rol_id) {
        const [rows] = await db.execute(
            `SELECT p.slug, p.nombre, p.modulo FROM rol_permiso rp JOIN permisos p ON rp.permiso_id = p.id WHERE rp.rol_id = ?`,
            [rol_id]
        );
        return rows;
    }

    static async registerAcceso(usuario_id, ip_address, user_agent, dispositivo) {
        await db.execute(
            `INSERT INTO historial_accesos (usuario_id, ip_address, user_agent, dispositivo) VALUES (?, ?, ?, ?)`,
            [usuario_id, ip_address, user_agent, dispositivo]
        );
    }
}

export default UsuarioModel;
