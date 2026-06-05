import { body, param } from 'express-validator';
import { validateResult } from '../middlewares/middlewares.validator.js';

const validateCreateEjercicio = [
    body('nombre', 'El nombre es obligatorio').notEmpty().trim(),
    body('descripcion', 'La descripción es obligatoria').notEmpty().trim(),
    body('grupo_muscular_cualidad', 'Grupo o cualidad es obligatorio').notEmpty().trim(),
    body('url_video_ejemplo', 'URL de video debe ser válida').optional().isURL(),
    validateResult
];

const validateCreatePlan = [
    body('nombre_plan', 'El nombre del plan es obligatorio').notEmpty().trim(),
    body('fecha_inicio', 'La fecha de inicio es obligatoria y debe ser válida').isDate(),
    body('fecha_fin', 'La fecha de fin es obligatoria y debe ser válida').isDate(),
    body('ejercicios', 'Ejercicios deben ser un array').optional().isArray(),
    body('ejercicios.*.ejercicio_id', 'ID de ejercicio inválido').isInt(),
    body('ejercicios.*.series', 'Series deben ser numéricas').isInt(),
    body('jugadores', 'Jugadores deben ser un array de IDs').optional().isArray(),
    validateResult
];

const validateUpdateEstadoPlan = [
    param('id', 'ID inválido').isInt(),
    body('estado', 'Estado inválido').isIn(['En Progreso', 'Completado', 'Cancelado']),
    validateResult
];

const validateId = [
    param('id', 'ID inválido').isInt(),
    validateResult
];

export { 
    validateCreateEjercicio,
    validateCreatePlan,
    validateUpdateEstadoPlan,
    validateId
 };
