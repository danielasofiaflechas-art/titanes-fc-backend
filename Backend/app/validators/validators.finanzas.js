import { body, param } from 'express-validator';
import { validateResult } from '../middlewares/middlewares.validator.js';

const validateGenerarLote = [
    body('mes', 'Mes inválido').isInt({ min: 1, max: 12 }),
    body('ano', 'Año inválido').isInt({ min: 2020 }),
    body('monto_pactado', 'Monto pactado obligatorio').isNumeric(),
    body('fecha_limite', 'Fecha límite válida obligatoria').isDate(),
    validateResult
];

const validatePago = [
    param('id', 'ID inválido').isInt(),
    body('monto_abonar', 'Monto a abonar obligatorio').isNumeric(),
    body('metodo_pago', 'Método inválido').isIn(['Efectivo', 'Transferencia Bancaria', 'Tarjeta de Crédito/Débito']),
    body('comprobante_url', 'URL inválida').optional().isURL(),
    validateResult
];

const validateRegistroInscripcion = [
    body('campeonato_id', 'ID Campeonato obligatorio').isInt(),
    body('equipo_titanes_id', 'ID Equipo obligatorio').isInt(),
    body('monto_total', 'Monto total obligatorio').isNumeric(),
    validateResult
];

export { 
    validateGenerarLote,
    validatePago,
    validateRegistroInscripcion
 };
