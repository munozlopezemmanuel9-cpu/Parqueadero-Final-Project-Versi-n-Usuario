/**
 * Controlador de Usuarios
 *
 * Maneja el CRUD completo de usuarios.
 * Solo accesible para administradores.
 */

const Usuario = require('../models/Usuario');

/**
 * Obtener todos los usuarios
 *
 * @route GET /api/usuarios
 * @access Admin
 */
async function listarUsuarios(req, res) {
    try {
        const usuarios = await Usuario.obtenerTodos();

        res.json({
            success: true,
            data: {
                usuarios,
            },
        });
    } catch (error) {
        console.error('Error al listar usuarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener usuarios',
            error: error.message,
        });
    }
}

/**
 * Obtener usuario por ID
 *
 * @route GET /api/usuarios/:id
 * @access Admin
 */
async function obtenerUsuario(req, res) {
    try {
        const { id } = req.params;
        const usuario = await Usuario.buscarPorId(id);

        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
            });
        }

        res.json({
            success: true,
            data: {
                usuario,
            },
        });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener usuario',
            error: error.message,
        });
    }
}

/**
 * Crear nuevo usuario
 *
 * @route POST /api/usuarios
 * @access Admin
 */
async function crearUsuario(req, res) {
    try {
        const { nombre, email, password, rol } = req.body;

        // Verificar si el email ya existe
        const existente = await Usuario.buscarPorEmail(email);

        if (existente) {
            return res.status(409).json({
                success: false,
                message: 'El email ya está registrado',
            });
        }

        const usuario = await Usuario.crear({
            nombre,
            email,
            password,
            rol,
        });

        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            data: {
                usuario,
            },
        });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear usuario',
            error: error.message,
        });
    }
}

/**
 * Actualizar usuario
 *
 * @route PUT /api/usuarios/:id
 * @access Admin
 */
async function actualizarUsuario(req, res) {
    try {
        const { id } = req.params;
        const { nombre, email, rol, activo, password } = req.body;

        // Verificar que el usuario existe
        const existente = await Usuario.buscarPorId(id);

        if (!existente) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
            });
        }

        // Verificar que no haya duplicado de email (si se está cambiando)
        if (email && email !== existente.email) {
            const emailExistente = await Usuario.buscarPorEmail(email);
            if (emailExistente) {
                return res.status(409).json({
                    success: false,
                    message: 'El email ya está en uso por otro usuario',
                });
            }
        }

        await Usuario.actualizar(id, {
            nombre,
            email,
            rol,
            activo,
            password: password || null,
        });

        const usuarioActualizado = await Usuario.buscarPorId(id);

        res.json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            data: {
                usuario: usuarioActualizado,
            },
        });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar usuario',
            error: error.message,
        });
    }
}

/**
 * Eliminar usuario (soft delete)
 *
 * @route DELETE /api/usuarios/:id
 * @access Admin
 */
async function eliminarUsuario(req, res) {
    try {
        const { id } = req.params;

        // Verificar que el usuario existe
        const existente = await Usuario.buscarPorId(id);

        if (!existente) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
            });
        }

        // No permitir eliminarse a sí mismo
        if (parseInt(id) === req.usuario.id) {
            return res.status(400).json({
                success: false,
                message: 'No puedes eliminar tu propio usuario',
            });
        }

        const resultado = await Usuario.eliminar(id);

        if (resultado.affectedRows === 0) {
            return res.status(400).json({
                success: false,
                message: 'No se pudo eliminar el usuario',
            });
        }

        res.json({
            success: true,
            message: 'Usuario eliminado exitosamente',
        });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar usuario',
            error: error.message,
        });
    }
}

module.exports = {
    listarUsuarios,
    obtenerUsuario,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
};
