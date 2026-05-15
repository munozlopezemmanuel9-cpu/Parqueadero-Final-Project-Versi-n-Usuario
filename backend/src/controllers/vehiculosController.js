/**
 * Controlador de Vehículos
 *
 * Maneja el registro y consulta de vehículos
 * que ingresan al parqueadero.
 */

const Vehiculo = require('../models/Vehiculo');

/**
 * Registrar vehículo (o buscar existente)
 *
 * @route POST /api/vehiculos
 * @access Privado
 */
async function registrarVehiculo(req, res) {
    try {
        const { placa, tipo, marca, modelo, color } = req.body;

        const vehiculo = await Vehiculo.crearOBuscar({
            placa,
            tipo,
            marca,
            modelo,
            color,
        });

        res.status(201).json({
            success: true,
            message: vehiculo.id ? 'Vehículo registrado' : 'Vehículo encontrado',
            data: {
                vehiculo,
            },
        });
    } catch (error) {
        console.error('Error al registrar vehículo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar vehículo',
            error: error.message,
        });
    }
}

/**
 * Buscar vehículo por placa
 *
 * @route GET /api/vehiculos/placa/:placa
 * @access Privado
 */
async function buscarPorPlaca(req, res) {
    try {
        const { placa } = req.params;
        const vehiculo = await Vehiculo.buscarPorPlaca(placa);

        if (!vehiculo) {
            return res.status(404).json({
                success: false,
                message: 'Vehículo no encontrado',
            });
        }

        res.json({
            success: true,
            data: {
                vehiculo,
            },
        });
    } catch (error) {
        console.error('Error al buscar vehículo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al buscar vehículo',
            error: error.message,
        });
    }
}

/**
 * Obtener historial de vehículos
 *
 * @route GET /api/vehiculos/historial
 * @access Privado
 */
async function obtenerHistorial(req, res) {
    try {
        const vehiculos = await Vehiculo.obtenerHistorial();

        res.json({
            success: true,
            data: {
                vehiculos,
            },
        });
    } catch (error) {
        console.error('Error al obtener historial:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener historial',
            error: error.message,
        });
    }
}

/**
 * Actualizar vehículo
 *
 * @route PUT /api/vehiculos/:id
 * @access Privado
 */
async function actualizarVehiculo(req, res) {
    try {
        const { id } = req.params;
        const { marca, modelo, color, tipo } = req.body;

        const existente = await Vehiculo.buscarPorId(id);

        if (!existente) {
            return res.status(404).json({
                success: false,
                message: 'Vehículo no encontrado',
            });
        }

        await Vehiculo.actualizar(id, { marca, modelo, color, tipo });

        const vehiculoActualizado = await Vehiculo.buscarPorId(id);

        res.json({
            success: true,
            message: 'Vehículo actualizado exitosamente',
            data: {
                vehiculo: vehiculoActualizado,
            },
        });
    } catch (error) {
        console.error('Error al actualizar vehículo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar vehículo',
            error: error.message,
        });
    }
}

module.exports = {
    registrarVehiculo,
    buscarPorPlaca,
    obtenerHistorial,
    actualizarVehiculo,
};
