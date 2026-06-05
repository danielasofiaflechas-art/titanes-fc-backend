import { validationResult } from 'express-validator';

const validateResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errors.array()
        });
    }
    next();
};

export { 
    validateResult
 };
