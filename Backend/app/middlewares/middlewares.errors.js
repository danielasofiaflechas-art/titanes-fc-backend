const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada',
    });
};

const errorHandler = (err, req, res, next) => {
    console.error(`[Error]: ${err.message}`);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Error interno del servidor',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

export { 
    notFoundHandler,
    errorHandler
 };
