import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import AuthModel from '../models/models.auth.js';

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Acceso denegado. Token no proporcionado.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, config.JWT_SECRET);

        // Verificar que el JTI es válido en la base de datos (seguridad estricta)
        const isValid = await AuthModel.isTokenValid(decoded.jti);
        if (!isValid) {
            return res.status(401).json({ success: false, message: 'Sesión inválida o expirada.' });
        }

        req.usuario = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token inválido o expirado.', error: error.message });
    }
};

export { 
    verifyToken
 };
