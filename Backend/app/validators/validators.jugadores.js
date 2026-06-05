import { body, param } from 'express-validator';
import { validateResult } from '../middlewares/middlewares.validator.js';

const validateCreateJugador = [
    // Datos Usuario
    body('nombre', 'El nombre es obligatorio').notEmpty().trim(),
    body('apellido', 'El apellido es obligatorio').notEmpty().trim(),
    body('email', 'Ingrese un email válido').isEmail().normalizeEmail(),
    body('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    
    // Datos Perfil Jugador
    body('categoria_id', 'La categoría es obligatoria y debe ser un número').isInt(),
    body('fecha_nacimiento', 'La fecha de nacimiento es obligatoria').isDate(),
    body('documento_identidad', 'El documento de identidad es obligatorio').notEmpty().trim(),
    body('posicion', 'Posición no válida').isIn(['Portero', 'Defensa Central', 'Lateral', 'Mediocentro', 'Extremo', 'Delantero Centro']),
    body('pierna_habil', 'Pierna hábil no válida').optional().isIn(['Derecha', 'Izquierda', 'Ambidiestro']),
    body('estatura_cm', 'Estatura debe ser numérica').optional().isInt(),
    body('peso_kg', 'Peso debe ser numérico').optional().isFloat(),
    validateResult
];

const validateUpdateJugador = [
    param('id', 'ID inválido').isInt(),
    body('categoria_id', 'La categoría debe ser un número').optional().isInt(),
    body('fecha_nacimiento', 'La fecha debe ser válida').optional().isDate(),
    body('posicion', 'Posición no válida').optional().isIn(['Portero', 'Defensa Central', 'Lateral', 'Mediocentro', 'Extremo', 'Delantero Centro']),
    validateResult
];

const validateId = [
    param('id', 'ID inválido').isInt(),
    validateResult
];

export { 
    validateCreateJugador,
    validateUpdateJugador,
    validateId
 };
