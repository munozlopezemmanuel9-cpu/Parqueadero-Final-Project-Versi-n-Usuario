/**
 * Controlador de Plazas
 *
 * Maneja la gestión de plazas/espacios
 * del parqueadero.
 */

const Plaza = require('../models/Plaza');

/**
 * Obtener todas las plazas
 *
 * @route GET /api/plazas
 * @access Privado
 */
async function listarPlazas(req, res) {
    try {
        const plazas = await Plaza.obtenerTodas();

        res.json({
            success: true,
            data: {
                plazas,
            },
        });
    } catch (error) {
        console.error('Error al listar plazas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener plazas',
            error: error.message,
        });
    }
}

/**
 * Obtener plazas disponibles
 *
 * @route GET /api/plazas/disponibles
 * @access Privado
 */
async function listarDisponibles(req, res) {
    try {
        const { tipo } = req.query;

        let plazas;
        if (tipo) {
            plazas = await Plaza.obtenerDisponiblesPorTipo(tipo);
        } else {
            plazas = await Plaza.obtenerPorEstado('libre');
        }

        res.json({
            success: true,
            data: {
                plazas,
            },
        });
    } catch (error) {
        console.error('Error al listar plazas disponibles:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener plazas disponibles',
            error: error.message,
        });
    }
}

/**
 * Obtener plaza por ID
 *
 * @route GET /api/plazas/:id
 * @access Privado
 */
async function obtenerPlaza(req, res) {
    try {
        const { id } = req.params;
        const plaza = await Plaza.buscarPorId(id);

        if (!plaza) {
            return res.status(404).json({
                success: false,
                message: 'Plaza no encontrada',
            });
        }

        res.json({
            success: true,
            data: {
                plaza,
            },
        });
    } catch (error) {
        console.error('Error al obtener plaza:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener plaza',
            error: error.message,
        });
    }
}

/**
 * Crear nueva plaza
 *
 * @route POST /api/plazas
 * @access Admin
 */
async function crearPlaza(req, res) {
    try {
        const { nombre, tipo, tarifa_por_hora } = req.body;

        const plaza = await Plaza.crear({ nombre, tipo, tarifa_por_hora });

        res.status(201).json({
            success: true,
            message: 'Plaza creada exitosamente',
            data: {
                plaza,
            },
        });
    } catch (error) {
        console.error('Error al crear plaza:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear plaza',
            error: error.message,
        });
    }
}

/**
 * Actualizar plaza
 *
 * @route PUT /api/plazas/:id
 * @access Admin
 */
async function actualizarPlaza(req, res) {
    try {
        const { id } = req.params;
        const { nombre, tipo, tarifa_por_hora, estado } = req.body;

        const existente = await Plaza.buscarPorId(id);

        if (!existente) {
            return res.status(404).json({
                success: false,
                message: 'Plaza no encontrada',
            });
        }

        await Plaza.actualizar(id, { nombre, tipo, tarifa_por_hora, estado });

        const plazaActualizada = await Plaza.buscarPorId(id);

        res.json({
            success: true,
            message: 'Plaza actualizada exitosamente',
            data: {
                plaza: plazaActualizada,
            },
        });
    } catch (error) {
        console.error('Error al actualizar plaza:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar plaza',
            error: error.message,
        });
    }
}

/**
 * Eliminar plaza (soft delete)
 *
 * @route DELETE /api/plazas/:id
 * @access Admin
 */
async function eliminarPlaza(req, res) {
    try {
        const { id } = req.params;

        const existente = await Plaza.buscarPorId(id);

        if (!existente) {
            return res.status(404).json({
                success: false,
                message: 'Plaza no encontrada',
            });
        }

        // Verificar que la plaza no esté ocupada
        if (existente.estado === 'ocupada') {
            return res.status(400).json({
                success: false,
                message: 'No se puede eliminar una plaza ocupada',
            });
        }

        await Plaza.desactivar(id);

        res.json({
            success: true,
            message: 'Plaza eliminada exitosamente',
        });
    } catch (error) {
        console.error('Error al eliminar plaza:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar plaza',
            error: error.message,
        });
    }
}

module.exports = {
    listarPlazas,
    listarDisponibles,
    obtenerPlaza,
    crearPlaza,
    actualizarPlaza,
    eliminarPlaza,
};
