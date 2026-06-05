import { body, param } from 'express-validator';
import { validateResult } from '../middlewares/middlewares.validator.js';

const validateCreateTestConfig = [
    body('nombre_test', 'Nombre del test es obligatorio').notEmpty().trim(),
    body('tipo_metrica', 'Tipo de métrica es obligatorio').notEmpty().trim(),
    body('descripcion', 'Descripción debe ser texto').optional().isString(),
    validateResult
];

const validateRegisterTest = [
    body('test_id', 'Test ID es obligatorio').isInt(),
    body('jugador_id', 'Jugador ID es obligatorio').isInt(),
    body('fecha_test', 'La fecha debe ser válida').isDate(),
    body('resultado_valor', 'El resultado es obligatorio').notEmpty().trim(),
    body('nivel_asignado', 'Nivel asignado inválido').isIn(['Excelente', 'Bueno', 'Promedio', 'Bajo', 'Deficiente']),
    validateResult
];

const validateEvaluacion = [
    body('jugador_id', 'Jugador ID es obligatorio').isInt(),
    body('fecha_evaluacion', 'La fecha debe ser válida').isDate(),
    body('puntuacion_tactica', 'Puntuación táctica inválida (1-10)').isInt({ min: 1, max: 10 }),
    body('puntuacion_fisica', 'Puntuación física inválida (1-10)').isInt({ min: 1, max: 10 }),
    body('puntuacion_tecnica', 'Puntuación técnica inválida (1-10)').isInt({ min: 1, max: 10 }),
    body('puntuacion_mental', 'Puntuación mental inválida (1-10)').isInt({ min: 1, max: 10 }),
    validateResult
];

const validateId = [
    param('id', 'ID inválido').isInt(),
    validateResult
];

export { 
    validateCreateTestConfig,
    validateRegisterTest,
    validateEvaluacion,
    validateId
 };
