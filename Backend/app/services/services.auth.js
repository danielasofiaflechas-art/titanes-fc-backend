import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from '../config/index.js';
import UsuarioModel from '../models/models.usuarios.js';
import AuthModel from '../models/models.auth.js';

class AuthService {
    static async login(email, password, clientInfo) {
        const user = await UsuarioModel.findByEmail(email);

        if (!user) {
            throw { statusCode: 401, message: 'Credenciales inválidas' };
        }

        if (user.estado !== 'activo') {
            throw { statusCode: 403, message: 'El usuario no está activo en el sistema' };
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw { statusCode: 401, message: 'Credenciales inválidas' };
        }

        // Obtener permisos
        const permisos = await UsuarioModel.getPermisos(user.rol_id);
        const permisosSlugs = permisos.map(p => p.slug);

        // Generar JTI único
        const jti = crypto.randomBytes(16).toString('hex');
        const jtiRefresh = crypto.randomBytes(16).toString('hex');

        // Payload
        const payload = {
            id: user.id,
            rol: user.rol_nombre,
            permisos: permisosSlugs,
            jti
        };

        // Generar Tokens
        const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });
        const refreshToken = jwt.sign({ id: user.id, jti: jtiRefresh }, config.REFRESH_TOKEN_SECRET, { expiresIn: config.REFRESH_TOKEN_EXPIRES_IN });

        // Guardar Tokens válidos en DB (prevenir replay attacks)
        const expDate = new Date();
        expDate.setDate(expDate.getDate() + 1); // asumiendo 1d de jwt_expires_in

        await AuthModel.registerValidToken(user.id, jti, expDate);

        // Actualizar último acceso e historial
        await UsuarioModel.updateUltimoAcceso(user.id);
        await UsuarioModel.registerAcceso(
            user.id, 
            clientInfo.ip, 
            clientInfo.userAgent, 
            clientInfo.dispositivo || 'Unknown'
        );

        return {
            usuario: {
                id: user.id,
                nombre: user.nombre,
                apellido: user.apellido,
                email: user.email,
                rol: user.rol_nombre,
                permisos: permisosSlugs
            },
            token,
            refreshToken
        };
    }

    static async logout(jti) {
        await AuthModel.invalidateToken(jti);
    }

    static async refresh(refreshToken) {
        try {
            // Verificar y decodificar refreshToken
            const decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);

            // Obtener usuario
            const user = await UsuarioModel.findById(decoded.id);
            if (!user || user.estado !== 'activo') {
                throw { statusCode: 401, message: 'Usuario inválido o inactivo' };
            }

            // Obtener permisos
            const permisos = await UsuarioModel.getPermisos(user.rol_id);
            const permisosSlugs = permisos.map(p => p.slug);

            // Generar nuevo JTI
            const jti = crypto.randomBytes(16).toString('hex');

            // Payload para nuevo token
            const payload = {
                id: user.id,
                rol: user.rol_nombre,
                permisos: permisosSlugs,
                jti
            };

            // Generar nuevo token
            const newToken = jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });

            // Guardar nuevo JTI en BD
            const expDate = new Date();
            expDate.setHours(expDate.getHours() + 2); // 2 horas de expiración
            await AuthModel.registerValidToken(user.id, jti, expDate);

            return {
                usuario: {
                    id: user.id,
                    nombre: user.nombre,
                    apellido: user.apellido,
                    email: user.email,
                    rol: user.rol_nombre,
                    permisos: permisosSlugs
                },
                token: newToken,
                refreshToken // El mismo refreshToken se puede reutilizar
            };
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw { statusCode: 401, message: 'Refresh token expirado' };
            } else if (error.name === 'JsonWebTokenError') {
                throw { statusCode: 401, message: 'Refresh token inválido' };
            }
            throw error;
        }
    }
}

export default AuthService;
