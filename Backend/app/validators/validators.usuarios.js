import { body, param } from 'express-validator';
import { validateResult } from '../middlewares/middlewares.validator.js';

const validateCreateUsuario = [
    body('rol_id', 'El rol es obligatorio y debe ser un número entero').isInt(),
    body('nombre', 'El nombre es obligatorio').notEmpty().trim(),
    body('apellido', 'El apellido es obligatorio').notEmpty().trim(),
    body('email', 'Ingrese un email válido').isEmail().normalizeEmail(),
    body('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    body('telefono', 'El teléfono es opcional pero debe ser string').optional().isString(),
    validateResult
];

const validateUpdateUsuario = [
    param('id', 'ID inválido').isInt(),
    body('rol_id', 'El rol debe ser un número entero').optional().isInt(),
    body('nombre', 'El nombre no puede estar vacío').optional().notEmpty().trim(),
    body('apellido', 'El apellido no puede estar vacío').optional().notEmpty().trim(),
    body('password', 'La contraseña debe tener al menos 6 caracteres').optional().isLength({ min: 6 }),
    body('estado', 'Estado inválido').optional().isIn(['activo', 'inactivo', 'suspendido']),
    validateResult
];

const validateId = [
    param('id', 'ID inválido').isInt(),
    validateResult
];

export { 
    validateCreateUsuario,
    validateUpdateUsuario,
    validateId
 };
