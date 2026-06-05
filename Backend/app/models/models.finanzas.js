import db from '../config/db.js';

class FinanzasModel {
    // --- Mensualidades ---
    static async getMensualidades({ jugador_id = null, estado_pago = null }) {
        let query = `
            SELECT fm.*, u.nombre, u.apellido, p.documento_identidad 
            FROM finanzas_mensualidades fm 
            JOIN perfil_jugadores p ON fm.jugador_id = p.usuario_id 
            JOIN usuarios u ON fm.jugador_id = u.id 
            WHERE 1=1
        `;
        const params = [];
        if (jugador_id) { query += ` AND fm.jugador_id = ?`; params.push(jugador_id); }
        if (estado_pago) { query += ` AND fm.estado_pago = ?`; params.push(estado_pago); }
        query += ` ORDER BY fm.ano_correspondiente DESC, fm.mes_correspondiente DESC`;
        const [rows] = await db.execute(query, params);
        return rows;
    }

    static async getMensualidadById(id) {
        const [rows] = await db.execute(`SELECT * FROM finanzas_mensualidades WHERE id = ?`, [id]);
        return rows[0];
    }

    static async generateMensualidadesLote(mes, ano, monto_pactado, fecha_limite) {
        // Obtenemos todos los jugadores activos
        const [jugadores] = await db.execute(`
            SELECT p.usuario_id 
            FROM perfil_jugadores p 
            JOIN usuarios u ON p.usuario_id = u.id 
            WHERE u.estado = 'activo'
        `);

        if (jugadores.length === 0) return 0;

        const connection = await db.getConnection();
        await connection.beginTransaction();
        try {
            for (let j of jugadores) {
                await connection.execute(
                    `INSERT IGNORE INTO finanzas_mensualidades (jugador_id, mes_correspondiente, ano_correspondiente, monto_pactado, fecha_limite_pago) 
                     VALUES (?, ?, ?, ?, ?)`,
                    [j.usuario_id, mes, ano, monto_pactado, fecha_limite]
                );
            }
            await connection.commit();
            return jugadores.length;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async registrarPagoMensualidad(mensualidad_id, monto_abonar, conexion = db) {
        // Actualizar monto pagado y recalcular estado
        const [rows] = await conexion.execute(
            `UPDATE finanzas_mensualidades 
             SET monto_pagado = monto_pagado + ?, 
                 estado_pago = CASE 
                    WHEN (monto_pactado - (monto_pagado)) <= 0 THEN 'Pagado'
                    ELSE 'Parcial'
                 END
             WHERE id = ?`,
            [monto_abonar, mensualidad_id]
        );
        return rows;
    }

    // --- Inscripciones Campeonatos ---
    static async getInscripciones() {
        const [rows] = await db.execute(`
            SELECT fi.*, c.nombre as campeonato_nombre, e.nombre_equipo_completo 
            FROM finanzas_inscripciones_campeonatos fi 
            JOIN campeonatos c ON fi.campeonato_id = c.id 
            JOIN equipos_titanes e ON fi.equipo_titanes_id = e.id
        `);
        return rows;
    }

    static async registrarInscripcion(data) {
        const { campeonato_id, equipo_titanes_id, monto_total } = data;
        const [result] = await db.execute(
            `INSERT INTO finanzas_inscripciones_campeonatos (campeonato_id, equipo_titanes_id, monto_total) 
             VALUES (?, ?, ?)`,
            [campeonato_id, equipo_titanes_id, monto_total]
        );
        return result.insertId;
    }

    // --- Transacciones / Caja ---
    static async registrarTransaccion(data, conexion = db) {
        const { tipo_transaccion, referencia_id, monto_transaccion, metodo_pago, comprobante_url, observaciones } = data;
        const [result] = await conexion.execute(
            `INSERT INTO historial_transacciones_caja (tipo_transaccion, referencia_id, monto_transaccion, metodo_pago, comprobante_url, observaciones) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [tipo_transaccion, referencia_id, monto_transaccion, metodo_pago, comprobante_url || null, observaciones || null]
        );
        return result.insertId;
    }

    static async getHistorialTransacciones({ mes = null, ano = null }) {
        let query = `SELECT * FROM historial_transacciones_caja WHERE 1=1`;
        const params = [];
        if (mes && ano) {
            query += ` AND MONTH(fecha_registro) = ? AND YEAR(fecha_registro) = ?`;
            params.push(mes, ano);
        }
        query += ` ORDER BY fecha_registro DESC`;
        const [rows] = await db.execute(query, params);
        return rows;
    }
}

export default FinanzasModel;
