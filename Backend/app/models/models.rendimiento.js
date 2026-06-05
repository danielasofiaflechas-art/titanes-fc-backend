import db from '../config/db.js';

class RendimientoModel {
    // --- Test Configuración ---
    static async getTestsConfig() {
        const [rows] = await db.execute(`SELECT * FROM test_configuracion ORDER BY nombre_test ASC`);
        return rows;
    }

    static async createTestConfig(data) {
        const { nombre_test, tipo_metrica, descripcion } = data;
        const [result] = await db.execute(
            `INSERT INTO test_configuracion (nombre_test, tipo_metrica, descripcion) VALUES (?, ?, ?)`,
            [nombre_test, tipo_metrica, descripcion || null]
        );
        return result.insertId;
    }

    // --- Test Resultados Jugadores ---
    static async registerTestResultado(data) {
        const { test_id, jugador_id, entrenador_id, fecha_test, resultado_valor, nivel_asignado, observacion } = data;
        const [result] = await db.execute(
            `INSERT INTO test_resultados_jugadores (test_id, jugador_id, entrenador_id, fecha_test, resultado_valor, nivel_asignado, observacion) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [test_id, jugador_id, entrenador_id, fecha_test, resultado_valor, nivel_asignado, observacion || null]
        );
        return result.insertId;
    }

    static async getResultadosTestJugador(jugador_id) {
        const [rows] = await db.execute(`
            SELECT tr.*, tc.nombre_test, tc.tipo_metrica, CONCAT(u.nombre, ' ', u.apellido) as evaluador_nombre 
            FROM test_resultados_jugadores tr 
            JOIN test_configuracion tc ON tr.test_id = tc.id 
            JOIN usuarios u ON tr.entrenador_id = u.id 
            WHERE tr.jugador_id = ? 
            ORDER BY tr.fecha_test DESC
        `, [jugador_id]);
        return rows;
    }

    // --- Evaluaciones Periódicas (Dashboard Deportivo) ---
    static async registerEvaluacionPeriodica(data) {
        const { jugador_id, entrenador_id, fecha_evaluacion, puntuacion_tactica, puntuacion_fisica, puntuacion_tecnica, puntuacion_mental, observaciones_tecnicas } = data;
        const [result] = await db.execute(
            `INSERT INTO evaluaciones_rendimiento_periodico 
             (jugador_id, entrenador_id, fecha_evaluacion, puntuacion_tactica, puntuacion_fisica, puntuacion_tecnica, puntuacion_mental, observaciones_tecnicas) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [jugador_id, entrenador_id, fecha_evaluacion, puntuacion_tactica, puntuacion_fisica, puntuacion_tecnica, puntuacion_mental, observaciones_tecnicas || null]
        );
        return result.insertId;
    }

    static async getEvaluacionesJugador(jugador_id) {
        const [rows] = await db.execute(`
            SELECT er.*, CONCAT(u.nombre, ' ', u.apellido) as evaluador_nombre 
            FROM evaluaciones_rendimiento_periodico er 
            JOIN usuarios u ON er.entrenador_id = u.id 
            WHERE er.jugador_id = ? 
            ORDER BY er.fecha_evaluacion ASC
        `, [jugador_id]); // Ascendente para gráficas de evolución
        return rows;
    }

    // --- Dashboard Deportivo Resumen (Métricas globales por jugador) ---
    static async getDashboardJugador(jugador_id) {
        // Promedios de evaluaciones
        const [promedios] = await db.execute(`
            SELECT AVG(puntuacion_tactica) as avg_tactica, AVG(puntuacion_fisica) as avg_fisica, 
                   AVG(puntuacion_tecnica) as avg_tecnica, AVG(puntuacion_mental) as avg_mental 
            FROM evaluaciones_rendimiento_periodico 
            WHERE jugador_id = ?
        `, [jugador_id]);

        // Asistencias globales
        const [asistencias] = await db.execute(`
            SELECT estado, COUNT(*) as cantidad 
            FROM asistencia_entrenamientos 
            WHERE jugador_id = ? GROUP BY estado
        `, [jugador_id]);

        return {
            promedios_rendimiento: promedios[0],
            estadisticas_asistencia: asistencias
        };
    }
}

export default RendimientoModel;
