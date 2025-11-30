/**
 * Middleware para verificar que el usuario tenga un rol específico
 * Debe usarse DESPUÉS del middleware verifyToken
 */
const verifyRole = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            // El verifyToken ya debería haber agregado req.userId
            if (!req.userId) {
                return res.status(401).json({ message: 'No autenticado.' });
            }

            // Buscar el usuario en la base de datos para obtener su rol
            const Usuario = require('../model/usuario');
            const user = await Usuario.findById(req.userId);

            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }

            // Verificar si el rol del usuario está en los roles permitidos
            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({
                    message: `Acceso denegado. Se requiere rol: ${allowedRoles.join(' o ')}.`
                });
            }

            // Agregar el rol al request para uso posterior si es necesario
            req.userRole = user.role;
            next();

        } catch (error) {
            console.error('Error en middleware verifyRole:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    };
};

module.exports = verifyRole;
