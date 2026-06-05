import AuthService from '../services/services.auth.js';

class AuthController {
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            
            const clientInfo = {
                ip: req.ip || req.connection.remoteAddress,
                userAgent: req.headers['user-agent'],
                dispositivo: req.headers['sec-ch-ua-platform'] || 'Unknown'
            };

            const data = await AuthService.login(email, password, clientInfo);

            res.status(200).json({
                success: true,
                message: 'Autenticación exitosa',
                data
            });
        } catch (error) {
            next(error);
        }
    }

    static async logout(req, res, next) {
        try {
            const jti = req.usuario.jti;
            await AuthService.logout(jti);

            res.status(200).json({
                success: true,
                message: 'Sesión cerrada correctamente'
            });
        } catch (error) {
            next(error);
        }
    }

    static async profile(req, res, next) {
        try {
            // El usuario ya viene en req.usuario desde el middleware de auth
            res.status(200).json({
                success: true,
                data: req.usuario
            });
        } catch (error) {
            next(error);
        }
    }

    static async refresh(req, res, next) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({
                    success: false,
                    message: 'Refresh token es requerido'
                });
            }

            const data = await AuthService.refresh(refreshToken);

            res.status(200).json({
                success: true,
                message: 'Token renovado exitosamente',
                data
            });
        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;
