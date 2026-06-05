import bcrypt from 'bcrypt';
import JugadorModel from '../models/models.jugadores.js';
import UsuarioModel from '../models/models.usuarios.js';
import db from '../config/db.js';

class JugadorService {
    static async getAllJugadores(queryParams) {
        const page = parseInt(queryParams.page) || 1;
        const limit = parseInt(queryParams.limit) || 10;
        const search = queryParams.search || '';
        const categoria_id = queryParams.categoria_id || null;

        const result = await JugadorModel.findAll({ page, limit, search, categoria_id });
        return {
            jugadores: result.data,
            paginacion: {
                totalRegistros: result.total,
                paginaActual: page,
                totalPaginas: Math.ceil(result.total / limit),
                limite: limit
            }
        };
    }

    static async getJugadorById(usuario_id) {
        const jugador = await JugadorModel.findById(usuario_id);
        if (!jugador) throw { statusCode: 404, message: 'Jugador no encontrado' };
        return jugador;
    }

    static async createJugador(data) {
        // Validación de documento único
        const existsDoc = await JugadorModel.findByDocumento(data.documento_identidad);
        if (existsDoc) throw { statusCode: 400, message: 'El documento de identidad ya está registrado' };

        // Empezar transacción para asegurar que se crea el usuario y el perfil de jugador
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // 1. Crear el usuario (Rol 3 = Jugador, idealmente debe buscarse por nombre 'Jugador')
            const hashedPassword = await bcrypt.hash(data.password, 10);
            const [userResult] = await connection.execute(
                `INSERT INTO usuarios (rol_id, nombre, apellido, email, password, telefono) VALUES (?, ?, ?, ?, ?, ?)`,
                [3, data.nombre, data.apellido, data.email, hashedPassword, data.telefono] // 3 = Jugador (según SQL enviado)
            );
            const nuevoUsuarioId = userResult.insertId;

            // 2. Crear el perfil del jugador
            await JugadorModel.create({
                ...data,
                usuario_id: nuevoUsuarioId
            }, connection);

            await connection.commit();
            return await JugadorModel.findById(nuevoUsuarioId);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async updateJugador(usuario_id, data) {
        const jugador = await JugadorModel.findById(usuario_id);
        if (!jugador) throw { statusCode: 404, message: 'Jugador no encontrado' };

        // Validar documento si cambia
        if (data.documento_identidad && data.documento_identidad !== jugador.documento_identidad) {
            const existsDoc = await JugadorModel.findByDocumento(data.documento_identidad);
            if (existsDoc) throw { statusCode: 400, message: 'El documento de identidad ya está registrado en otro jugador' };
        }

        // Actualizar usuario general y perfil jugador
        await UsuarioModel.update(usuario_id, {
            rol_id: 3, // Siempre jugador
            nombre: data.nombre || jugador.nombre,
            apellido: data.apellido || jugador.apellido,
            telefono: data.telefono || jugador.telefono,
            estado: data.estado || jugador.estado
        });

        await JugadorModel.update(usuario_id, data);
        return await JugadorModel.findById(usuario_id);
    }
}

export default JugadorService;
