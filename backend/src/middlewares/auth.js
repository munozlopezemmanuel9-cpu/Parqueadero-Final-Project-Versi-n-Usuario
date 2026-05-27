/**
 * Middleware de Autenticación y Autorización
 *
 * Verifica que las solicitudes incluyan un token JWT válido
 * y que el usuario tenga los permisos necesarios.
 */

const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

/**
 * Middleware para verificar autenticación
 *
 * Este middleware se coloca en las rutas que requieren login.
 * Extrae el token del header Authorization, lo verifica y
 * agrega la información del usuario a la solicitud.
 *
 * @param {Object} req - Solicitud Express
 * @param {Object} res - Respuesta Express
 * @param {Function} next - Siguiente middleware
 */
async function verificarAuth(req, res, next) {
    try {
        // Obtener token del header
        // Formato esperado: "Bearer <token>"
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No se proporcionó token de autenticación',
            });
        }

        const token = authHeader.split(' ')[1];

        // Verificar token con el secreto del servidor
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar usuario en la base de datos
        const usuario = await Usuario.buscarPorId(decoded.id);

        if (!usuario || !usuario.activo) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no encontrado o inactivo',
            });
        }

        // Agregar usuario a la solicitud para uso en controladores
        req.usuario = usuario;

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token inválido',
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado. Por favor inicia sesión nuevamente.',
            });
        }

        console.error('Error en autenticación:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
}

/**
 * Middleware para verificar rol de usuario
 *
 * Se usa después de verificarAuth para restringir
 * acceso a ciertos roles específicos.
 *
 * @param  {...string} roles - Roles permitidos para esta ruta
 * @returns {Function} Middleware de Express
 */
function verificarRol(...roles) {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado',
            });
        }

        // Verificar si el rol del usuario está en los permitidos
        if (!roles.includes(req.usuario.rol)) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para realizar esta acción',
            });
        }

        next();
    };
}

/**
 * Generar token JWT para usuario
 *
 * @param {Object} usuario - Datos del usuario
 * @returns {string} Token JWT
 */
function generarToken(usuario) {
    return jwt.sign(
        {
            id: usuario.id,
            email: usuario.email,
            rol: usuario.rol,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
}

/**
 * Middleware para verificar si el usuario es personal del parqueadero (Admin o Empleado)
 */
function verificarStaff(req, res, next) {
    return verificarRol('admin', 'empleado')(req, res, next);
}

module.exports = {
    verificarAuth,
    verificarRol,
    verificarStaff,
    generarToken,
};
