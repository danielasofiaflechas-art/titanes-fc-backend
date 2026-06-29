import FinanzasModel from '../models/models.finanzas.js';
import db from '../config/db.js';

class FinanzasService {
    static async getMensualidades(queryParams, usuario_request) {
        let jugador_id = queryParams.jugador_id || null;
        if (usuario_request.rol === 'Jugador') {
            jugador_id = usuario_request.id; // Fuerza a que solo vea las suyas
        }
        return await FinanzasModel.getMensualidades({ jugador_id, estado_pago: queryParams.estado_pago });
    }

    static async generarMensualidadesLote(data) {
        const connection = await db.getConnection();
        await connection.beginTransaction();
        try {
            // Obtener todos los jugadores activos
            const [jugadores] = await connection.execute(
                `SELECT DISTINCT p.usuario_id FROM perfil_jugadores p 
                 JOIN usuarios u ON p.usuario_id = u.id 
                 WHERE u.estado = 'activo'`
            );

            if (!jugadores || jugadores.length === 0) {
                throw { statusCode: 400, message: 'No hay jugadores activos para generar mensualidades' };
            }

            const generadas = [];
            for (const jugador of jugadores) {
                // Verificar si ya existe mensualidad para este mes/año
                const [existe] = await connection.execute(
                    `SELECT id FROM finanzas_mensualidades
                    WHERE jugador_id = ?
                    AND mes_correspondiente = ? 
                    AND ano_correspondiente = ?`,
                    [jugador.usuario_id, data.mes, data.ano]
                );

                if (!existe || existe.length === 0) {
                    // Crear mensualidad
                    const [result] = await connection.execute(
                        `INSERT INTO finanzas_mensualidades 
                         (jugador_id, mes_correspondiente, ano_correspondiente, monto_pactado, monto_pagado, estado_pago, fecha_limite_pago) 
                         VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [jugador.usuario_id, data.mes, data.ano, data.monto_pactado, 0, 'Pendiente', data.fecha_limite]
                    );
                    generadas.push({ id: result.insertId, jugador_id: jugador.usuario_id });
                }
            }

            // Registrar transacción de generación
            if (generadas.length > 0) {
                await connection.execute(
                    `INSERT INTO historial_transacciones_caja 
                     (tipo_transaccion, monto_transaccion, observaciones) 
                     VALUES (?, ?, ?)`,
                    [`Generación de ${generadas.length} mensualidades`, data.monto_pactado * generadas.length, `Mes ${data.mes}/${data.ano}`]
                );
            }

            await connection.commit();
            return { mensaje: `${generadas.length} mensualidades generadas correctamente`, generadas };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async pagarMensualidad(id, data) {
        const mensualidad = await FinanzasModel.getMensualidadById(id);
        if (!mensualidad) throw { statusCode: 404, message: 'Mensualidad no encontrada' };

        const connection = await db.getConnection();
        await connection.beginTransaction();
        try {
            await FinanzasModel.registrarPagoMensualidad(id, data.monto_abonar, connection);
            await FinanzasModel.registrarTransaccion({
                tipo_transaccion: 'Ingreso Mensualidad',
                referencia_id: id,
                monto_transaccion: data.monto_abonar,
                metodo_pago: data.metodo_pago,
                comprobante_url: data.comprobante_url,
                observaciones: data.observaciones
            }, connection);
            
            await connection.commit();
            return await FinanzasModel.getMensualidadById(id);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Inscripciones
    static async getInscripciones() {
        return await FinanzasModel.getInscripciones();
    }

    static async registrarInscripcion(data) {
        const connection = await db.getConnection();
        await connection.beginTransaction();
        try {
            // Verificar que el campeonato existe
            const [campeonato] = await connection.execute(
                'SELECT id, valor_inscripcion FROM campeonatos WHERE id = ?',
                [data.campeonato_id]
            );
            if (!campeonato || campeonato.length === 0) {
                throw { statusCode: 404, message: 'Campeonato no encontrado' };
            }

            // Verificar que el equipo existe
            const [equipo] = await connection.execute(
                'SELECT id FROM equipos_titanes WHERE id = ?',
                [data.equipo_titanes_id]
            );
            if (!equipo || equipo.length === 0) {
                throw { statusCode: 404, message: 'Equipo no encontrado' };
            }

            // Verificar que no exista inscripción duplicada
            const [existente] = await connection.execute(
                `SELECT id FROM finanzas_inscripciones_campeonatos 
                 WHERE campeonato_id = ? AND equipo_titanes_id = ?`,
                [data.campeonato_id, data.equipo_titanes_id]
            );
            if (existente && existente.length > 0) {
                throw { statusCode: 409, message: 'El equipo ya está inscrito en este campeonato' };
            }

            // Registrar inscripción
            const [result] = await connection.execute(
                `INSERT INTO finanzas_inscripciones_campeonatos 
                 (campeonato_id, equipo_titanes_id, monto_total, monto_abonado, estado_pago, fecha_pago_registro) 
                 VALUES (?, ?, ?, ?, ?, NOW())`,
                [data.campeonato_id, data.equipo_titanes_id, data.monto_total, data.monto_total,'Pagado']
            );

            // Registrar transacción en caja
            await connection.execute(
                `INSERT INTO historial_transacciones_caja 
                 (tipo_transaccion, monto_transaccion, observaciones) 
                 VALUES (?, ?, ?)`,
                ['Pago Inscripción Campeonato', data.monto_total, `Equipo ${data.equipo_titanes_id} - Campeonato ${data.campeonato_id}`]
            );

            await connection.commit();
            return { id: result.insertId, ...data };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Historial Caja
    static async getHistorialTransacciones(queryParams) {
        return await FinanzasModel.getHistorialTransacciones({ mes: queryParams.mes, ano: queryParams.ano });
    }
}

export default FinanzasService;
