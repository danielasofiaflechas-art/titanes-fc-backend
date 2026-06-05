import { body, param } from 'express-validator';
import { validateResult } from '../middlewares/middlewares.validator.js';

const validateCreateEntrenamiento = [
    body('categoria_id', 'La categoría es obligatoria').isInt(),
    body('fecha_hora', 'La fecha y hora son obligatorias y en formato válido').isISO8601(),
    body('lugar', 'El lugar es obligatorio').notEmpty().trim(),
    body('objetivo_sesion', 'El objetivo es obligatorio').notEmpty().trim(),
    body('observaciones_generales', 'Observaciones deben ser texto').optional().isString(),
    validateResult
];

const validateUpdateEntrenamiento = [
    param('id', 'ID inválido').isInt(),
    body('fecha_hora', 'La fecha debe ser válida').optional().isISO8601(),
    body('lugar', 'El lugar no puede estar vacío').optional().notEmpty().trim(),
    validateResult
];

const validateAsistencia = [
    param('id', 'ID de entrenamiento inválido').isInt(),
    body('asistencia', 'La asistencia debe ser un array de objetos').isArray({ min: 1 }),
    body('asistencia.*.jugador_id', 'ID de jugador inválido').isInt(),
    body('asistencia.*.estado', 'Estado de asistencia inválido').isIn(['Presente', 'Ausente', 'Justificado', 'Retraso']),
    validateResult
];

const validateId = [
    param('id', 'ID inválido').isInt(),
    validateResult
];

export { 
    validateCreateEntrenamiento,
    validateUpdateEntrenamiento,
    validateAsistencia,
    validateId
 };
