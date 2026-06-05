import { body, param } from 'express-validator';
import { validateResult } from '../middlewares/middlewares.validator.js';

const validateCreateEntrenador = [
    // Datos Usuario
    body('nombre', 'El nombre es obligatorio').notEmpty().trim(),
    body('apellido', 'El apellido es obligatorio').notEmpty().trim(),
    body('email', 'Ingrese un email válido').isEmail().normalizeEmail(),
    body('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    
    // Datos Perfil Entrenador
    body('licencia', 'La licencia debe ser texto').optional().isString(),
    body('especialidad', 'La especialidad debe ser texto').optional().isString(),
    body('experiencia_anos', 'La experiencia debe ser un número').optional().isInt({ min: 0 }),
    body('categorias', 'Las categorías deben ser un arreglo de IDs').optional().isArray(),
    validateResult
];

const validateUpdateEntrenador = [
    param('id', 'ID inválido').isInt(),
    body('experiencia_anos', 'La experiencia debe ser un número').optional().isInt({ min: 0 }),
    body('categorias', 'Las categorías deben ser un arreglo de IDs').optional().isArray(),
    validateResult
];

const validateId = [
    param('id', 'ID inválido').isInt(),
    validateResult
];

export { 
    validateCreateEntrenador,
    validateUpdateEntrenador,
    validateId
 };
