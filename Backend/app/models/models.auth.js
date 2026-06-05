import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import db from '../config/db.js';

class AuthModel {
    static async registerValidToken(usuario_id, jti, expiracion) {
        await db.execute(
            `INSERT INTO jwt_tokens_validos (usuario_id, token_jti, expiracion) 
             VALUES (?, ?, ?)`,
            [usuario_id, jti, expiracion]
        );
    }

    static async isTokenValid(jti) {
        const [rows] = await db.execute(
            `SELECT * FROM jwt_tokens_validos WHERE token_jti = ? AND expiracion > NOW()`,
            [jti]
        );
        return rows.length > 0;
    }

    static async invalidateToken(jti) {
        await db.execute(`DELETE FROM jwt_tokens_validos WHERE token_jti = ?`, [jti]);
    }
}

export default AuthModel;
