import db from '../config/db.js';

class DashboardModel {
    static async getAdminStats() {
        const [[totalJugadores]] = await db.execute(`SELECT COUNT(*) as total FROM perfil_jugadores p JOIN usuarios u ON p.usuario_id = u.id WHERE u.estado = 'activo'`);
        const [[totalEntrenadores]] = await db.execute(`SELECT COUNT(*) as total FROM perfil_entrenadores p JOIN usuarios u ON p.usuario_id = u.id WHERE u.estado = 'activo'`);
        const [[campeonatosActivos]] = await db.execute(`SELECT COUNT(*) as total FROM campeonatos WHERE estado IN ('Inscripción', 'En Curso')`);
        
        const [[ingresosCaja]] = await db.execute(`
            SELECT SUM(monto_transaccion) as total 
            FROM historial_transacciones_caja 
            WHERE tipo_transaccion LIKE '%Ingreso%'
        `);

        const [[mensualidadesPendientes]] = await db.execute(`
            SELECT COUNT(*) as total, SUM(monto_pactado - monto_pagado) as deuda_total 
            FROM finanzas_mensualidades 
            WHERE estado_pago IN ('Pendiente', 'Parcial', 'Vencido')
        `);

        const [proximosPartidos] = await db.execute(`
            SELECT p.*, e.nombre_equipo_completo 
            FROM partidos_programacion p 
            JOIN equipos_titanes e ON p.equipo_titanes_id = e.id 
            WHERE p.resultado_final = 'Por Jugar' 
            ORDER BY p.fecha_hora_partido ASC LIMIT 5
        `);

        return {
            total_jugadores: totalJugadores.total,
            total_entrenadores: totalEntrenadores.total,
            campeonatos_activos: campeonatosActivos.total,
            ingresos_caja: ingresosCaja.total || 0,
            mensualidades_pendientes_count: mensualidadesPendientes.total,
            deuda_total_estimada: mensualidadesPendientes.deuda_total || 0,
            proximos_partidos: proximosPartidos
        };
    }

    static async getEntrenadorStats(entrenador_id) {
        const [proximosEntrenamientos] = await db.execute(`
            SELECT ep.*, c.nombre as categoria_nombre 
            FROM entrenamientos_programacion ep 
            JOIN categorias c ON ep.categoria_id = c.id 
            WHERE ep.entrenador_id = ? AND ep.fecha_hora >= NOW() 
            ORDER BY ep.fecha_hora ASC LIMIT 5
        `, [entrenador_id]);

        const [[jugadoresAsignados]] = await db.execute(`
            SELECT COUNT(DISTINCT p.usuario_id) as total 
            FROM perfil_jugadores p 
            JOIN categoria_entrenador ce ON p.categoria_id = ce.categoria_id 
            WHERE ce.entrenador_id = ?
        `, [entrenador_id]);

        return {
            total_jugadores_asignados: jugadoresAsignados.total,
            proximos_entrenamientos: proximosEntrenamientos
        };
    }

    static async getJugadorStats(jugador_id) {
        const [proximosEntrenamientos] = await db.execute(`
            SELECT ep.*, c.nombre as categoria_nombre 
            FROM entrenamientos_programacion ep 
            JOIN perfil_jugadores p ON ep.categoria_id = p.categoria_id 
            JOIN categorias c ON ep.categoria_id = c.id 
            WHERE p.usuario_id = ? AND ep.fecha_hora >= NOW() 
            ORDER BY ep.fecha_hora ASC LIMIT 5
        `, [jugador_id]);

        const [pagosPendientes] = await db.execute(`
            SELECT * FROM finanzas_mensualidades 
            WHERE jugador_id = ? AND estado_pago IN ('Pendiente', 'Parcial', 'Vencido') 
            ORDER BY fecha_limite_pago ASC
        `, [jugador_id]);

        return {
            proximos_entrenamientos: proximosEntrenamientos,
            pagos_pendientes: pagosPendientes
        };
    }
}

export default DashboardModel;
