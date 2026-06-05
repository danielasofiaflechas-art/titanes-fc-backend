import bcrypt from 'bcrypt';
import UsuarioModel from '../models/models.usuarios.js';

class UsuarioService {
    static async getAllUsuarios(queryParams) {
        const page = parseInt(queryParams.page) || 1;
        const limit = parseInt(queryParams.limit) || 10;
        const search = queryParams.search || '';

        const result = await UsuarioModel.findAll({ page, limit, search });
        return {
            usuarios: result.data,
            paginacion: {
                totalRegistros: result.total,
                paginaActual: page,
                totalPaginas: Math.ceil(result.total / limit),
                limite: limit
            }
        };
    }

    static async getUsuarioById(id) {
        const usuario = await UsuarioModel.findById(id);
        if (!usuario) {
            throw { statusCode: 404, message: 'Usuario no encontrado' };
        }
        return usuario;
    }

    static async createUsuario(data) {
        const exists = await UsuarioModel.findByEmail(data.email);
        if (exists) {
            throw { statusCode: 400, message: 'El correo electrónico ya está registrado' };
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const insertId = await UsuarioModel.create({ ...data, password: hashedPassword });
        
        return await UsuarioModel.findById(insertId);
    }

    static async updateUsuario(id, data) {
        const usuario = await UsuarioModel.findById(id);
        if (!usuario) {
            throw { statusCode: 404, message: 'Usuario no encontrado' };
        }

        // Si se provee contraseña, se encripta, si no, no se actualiza por esta vía
        if (data.password) {
            const hashedPassword = await bcrypt.hash(data.password, 10);
            await UsuarioModel.updatePassword(id, hashedPassword);
        }

        await UsuarioModel.update(id, data);
        return await UsuarioModel.findById(id);
    }

    static async deleteUsuario(id) {
        const usuario = await UsuarioModel.findById(id);
        if (!usuario) {
            throw { statusCode: 404, message: 'Usuario no encontrado' };
        }

        // Soft delete (estado = suspendido)
        await UsuarioModel.delete(id);
        return { id, estado: 'suspendido' };
    }
}

export default UsuarioService;
