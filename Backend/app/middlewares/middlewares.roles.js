const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.usuario || !req.usuario.rol) {
            return res.status(401).json({ success: false, message: 'Usuario no autenticado o rol indefinido' });
        }

        const hasRole = allowedRoles.includes(req.usuario.rol);
        if (!hasRole) {
            return res.status(403).json({ success: false, message: 'Acceso denegado: No tienes el rol necesario' });
        }

        next();
    };
};

const verifyPermisos = (...allowedPermisos) => {
    return (req, res, next) => {
        if (!req.usuario || !req.usuario.permisos) {
            return res.status(401).json({ success: false, message: 'Usuario no autenticado o permisos indefinidos' });
        }

        // Si es el Administrador principal, se le puede dar pase libre (opcional)
        // if (req.usuario.rol === 'Administrador') return next();

        const hasPermiso = allowedPermisos.some(permiso => req.usuario.permisos.includes(permiso));
        if (!hasPermiso) {
            return res.status(403).json({ success: false, message: 'Acceso denegado: No tienes los permisos necesarios' });
        }

        next();
    };
};

export { 
    verifyRoles,
    verifyPermisos
 };
