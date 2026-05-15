/**
 * Controlador de Autenticación
 *
 * Maneja el registro, login y gestión de sesiones
 * de los usuarios del sistema.
 */

const Usuario = require('../models/Usuario');
const { generarToken } = require('../middlewares/auth');

/**
 * Registrar nuevo usuario
 *
 * @route POST /api/auth/registro
 * @access Público (solo en desarrollo, en producción debería ser admin-only)
 */
async function registro(req, res) {
    try {
        const { nombre, email, password, rol } = req.body;

        // Verificar si el email ya está registrado
        const existente = await Usuario.buscarPorEmail(email);

        if (existente) {
            return res.status(409).json({
                success: false,
                message: 'El email ya está registrado',
            });
        }

        // Crear usuario
        const usuario = await Usuario.crear({
            nombre,
            email,
            password,
            rol: rol || 'empleado',
        });

        // Generar token JWT
        const token = generarToken(usuario);

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: {
                usuario,
                token,
            },
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar usuario',
            error: error.message,
        });
    }
}

/**
 * Iniciar sesión
 *
 * @route POST /api/auth/login
 * @access Público
 */
async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Verificar credenciales
        const usuario = await Usuario.verificarCredenciales(email, password);

        if (!usuario) {
            return res.status(401).json({
                success: false,
                message: 'Email o contraseña incorrectos',
            });
        }

        // Generar token JWT
        const token = generarToken(usuario);

        res.json({
            success: true,
            message: 'Inicio de sesión exitoso',
            data: {
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    rol: usuario.rol,
                },
                token,
            },
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error al iniciar sesión',
            error: error.message,
        });
    }
}

/**
 * Obtener perfil del usuario actual
 *
 * @route GET /api/auth/perfil
 * @access Privado (requiere autenticación)
 */
async function obtenerPerfil(req, res) {
    try {
        // El usuario ya está disponible gracias al middleware verificarAuth
        const usuario = await Usuario.buscarPorId(req.usuario.id);

        res.json({
            success: true,
            data: {
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    rol: usuario.rol,
                    activo: usuario.activo,
                    creado_en: usuario.creado_en,
                },
            },
        });
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener perfil',
            error: error.message,
        });
    }
}

/**
 * Actualizar perfil del usuario
 *
 * @route PUT /api/auth/perfil
 * @access Privado
 */
async function actualizarPerfil(req, res) {
    try {
        const { nombre, password } = req.body;

        // No permitir cambiar email o rol desde el perfil
        await Usuario.actualizar(req.usuario.id, {
            nombre,
            password: password || null,
        });

        const usuarioActualizado = await Usuario.buscarPorId(req.usuario.id);

        res.json({
            success: true,
            message: 'Perfil actualizado exitosamente',
            data: {
                usuario: {
                    id: usuarioActualizado.id,
                    nombre: usuarioActualizado.nombre,
                    email: usuarioActualizado.email,
                    rol: usuarioActualizado.rol,
                },
            },
        });
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar perfil',
            error: error.message,
        });
    }
}

module.exports = {
    registro,
    login,
    obtenerPerfil,
    actualizarPerfil,
};
