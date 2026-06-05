import { body, param } from 'express-validator';
import { validateResult } from '../middlewares/middlewares.validator.js';

const validateCreateCampeonato = [
    body('nombre', 'Nombre obligatorio').notEmpty().trim(),
    body('organizador', 'Organizador obligatorio').notEmpty().trim(),
    body('temporada_ano', 'Temporada obligatoria').notEmpty().trim(),
    body('valor_inscripcion', 'Valor inscripción debe ser numérico').isNumeric(),
    body('fecha_inicio', 'Fecha inicio válida obligatoria').isDate(),
    body('fecha_fin', 'Fecha fin válida obligatoria').isDate(),
    validateResult
];

const validateCreateEquipo = [
    body('categoria_id', 'Categoria ID obligatorio').isInt(),
    body('nombre_equipo_completo', 'Nombre de equipo obligatorio').notEmpty().trim(),
    body('identificacion_unica_club', 'ID único obligatorio').notEmpty().trim(),
    validateResult
];

const validateInscripcion = [
    body('campeonato_id', 'Campeonato ID obligatorio').isInt(),
    body('equipo_titanes_id', 'Equipo ID obligatorio').isInt(),
    validateResult
];

const validateCreatePartido = [
    body('campeonato_id', 'Campeonato ID obligatorio').isInt(),
    body('equipo_titanes_id', 'Equipo ID obligatorio').isInt(),
    body('rival_nombre', 'Rival obligatorio').notEmpty().trim(),
    body('fase_campeonato', 'Fase obligatoria').notEmpty().trim(),
    body('fecha_hora_partido', 'Fecha y hora válidas obligatorias').isISO8601(),
    body('lugar_cancha', 'Lugar obligatorio').notEmpty().trim(),
    validateResult
];

const validateUpdateResultado = [
    param('id', 'ID inválido').isInt(),
    body('goles_titanes', 'Goles titanes debe ser número').isInt({ min: 0 }),
    body('goles_rival', 'Goles rival debe ser número').isInt({ min: 0 }),
    body('resultado_final', 'Resultado inválido').isIn(['Victoria', 'Empate', 'Derrota']),
    validateResult
];

export { 
    validateCreateCampeonato,
    validateCreateEquipo,
    validateInscripcion,
    validateCreatePartido,
    validateUpdateResultado
 };
