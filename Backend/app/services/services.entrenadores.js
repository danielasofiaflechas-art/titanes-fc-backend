import bcrypt from 'bcrypt';
import EntrenadorModel from '../models/models.entrenadores.js';
import UsuarioModel from '../models/models.usuarios.js';
import db from '../config/db.js';

class EntrenadorService {
    static async getAllEntrenadores(queryParams) {
        const page = parseInt(queryParams.page) || 1;
        const limit = parseInt(queryParams.limit) || 10;
        const search = queryParams.search || '';

        const result = await EntrenadorModel.findAll({ page, limit, search });
        return {
            entrenadores: result.data,
            paginacion: {
                totalRegistros: result.total,
                paginaActual: page,
                totalPaginas: Math.ceil(result.total / limit),
                limite: limit
            }
        };
    }

    static async getEntrenadorById(usuario_id) {
        const entrenador = await EntrenadorModel.findById(usuario_id);
        if (!entrenador) throw { statusCode: 404, message: 'Entrenador no encontrado' };
        return entrenador;
    }

    static async createEntrenador(data) {
        // Validación de email
        const existsUser = await UsuarioModel.findByEmail(data.email);
        if (existsUser) throw { statusCode: 400, message: 'El correo electrónico ya está registrado' };

        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // 1. Crear el usuario (Rol 2 = Entrenador)
            const hashedPassword = await bcrypt.hash(data.password, 10);
            const [userResult] = await connection.execute(
                `INSERT INTO usuarios (rol_id, nombre, apellido, email, password, telefono) VALUES (?, ?, ?, ?, ?, ?)`,
                [2, data.nombre, data.apellido, data.email, hashedPassword, data.telefono]
            );
            const nuevoUsuarioId = userResult.insertId;

            // 2. Crear perfil entrenador
            await EntrenadorModel.create({
                ...data,
                usuario_id: nuevoUsuarioId
            }, connection);

            // 3. Asignar categorías (si existen en el payload array de IDs)
            if (data.categorias && Array.isArray(data.categorias)) {
                for (let catId of data.categorias) {
                    await EntrenadorModel.assignCategoria(nuevoUsuarioId, catId, connection);
                }
            }

            await connection.commit();
            return await EntrenadorModel.findById(nuevoUsuarioId);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async updateEntrenador(usuario_id, data) {
        const entrenador = await EntrenadorModel.findById(usuario_id);
        if (!entrenador) throw { statusCode: 404, message: 'Entrenador no encontrado' };

        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // Actualizar usuario general y perfil entrenador
            await connection.execute(
                `UPDATE usuarios SET nombre = ?, apellido = ?, telefono = ?, estado = ? WHERE id = ?`,
                [data.nombre || entrenador.nombre, data.apellido || entrenador.apellido, data.telefono || entrenador.telefono, data.estado || entrenador.estado, usuario_id]
            );

            await connection.execute(
                `UPDATE perfil_entrenadores SET licencia = ?, especialidad = ?, experiencia_anos = ? WHERE usuario_id = ?`,
                [data.licencia !== undefined ? data.licencia : entrenador.licencia, 
                 data.especialidad !== undefined ? data.especialidad : entrenador.especialidad, 
                 data.experiencia_anos !== undefined ? data.experiencia_anos : entrenador.experiencia_anos, 
                 usuario_id]
            );

            // Actualizar categorías asignadas
            if (data.categorias && Array.isArray(data.categorias)) {
                await EntrenadorModel.clearCategorias(usuario_id, connection);
                for (let catId of data.categorias) {
                    await EntrenadorModel.assignCategoria(usuario_id, catId, connection);
                }
            }

            await connection.commit();
            return await EntrenadorModel.findById(usuario_id);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

export default EntrenadorService;
