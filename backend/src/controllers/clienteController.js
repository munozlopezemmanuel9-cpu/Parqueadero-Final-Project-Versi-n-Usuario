/**
 * Controlador de Cliente
 *
 * Maneja la experiencia del usuario final (propietario de vehículo).
 * Permite consultar sus propios vehículos, historial de movimientos y estado general.
 */

const Vehiculo = require('../models/Vehiculo');
const Movimiento = require('../models/Movimiento');
const Plaza = require('../models/Plaza');
const db = require('../config/database');

/**
 * Obtener vehículos pertenecientes al cliente
 *
 * @route GET /api/cliente/mis-vehiculos
 * @access Cliente
 */
async function obtenerMisVehiculos(req, res) {
    try {
        const usuarioId = req.usuario.id;

        const sql = 'SELECT * FROM vehiculos WHERE propietario_id = ?';
        const vehiculos = await db.query(sql, [usuarioId]);

        res.json({
            success: true,
            data: {
                vehiculos,
            },
        });
    } catch (error) {
        console.error('Error al obtener mis vehículos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener sus vehículos',
            error: error.message,
        });
    }
}

/**
 * Obtener historial de movimientos de los vehículos del cliente
 *
 * @route GET /api/cliente/mi-historial
 * @access Cliente
 */
async function obtenerMiHistorial(req, res) {
    try {
        const usuarioId = req.usuario.id;

        const sql = `
            SELECT m.*, v.placa, p.nombre as plaza_nombre
            FROM movimientos m
            JOIN vehiculos v ON m.vehiculo_id = v.id
            JOIN plazas p ON m.plaza_id = p.id
            WHERE v.propietario_id = ?
            ORDER BY m.fecha_entrada DESC
        `;
        const historial = await db.query(sql, [usuarioId]);

        res.json({
            success: true,
            data: {
                historial,
            },
        });
    } catch (error) {
        console.error('Error al obtener mi historial:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener su historial de movimientos',
            error: error.message,
        });
    }
}

/**
 * Obtener estado actual del parqueadero (solo lectura)
 * Permite al cliente ver cuántas plazas hay libres antes de ir.
 *
 * @route GET /api/cliente/estado-parqueadero
 * @access Cliente
 */
async function verEstadoParqueadero(req, res) {
    try {
        const sql = `
            SELECT tipo,
                   COUNT(*) as total,
                   SUM(CASE WHEN estado = 'libre' THEN 1 ELSE 0 END) as disponibles
            FROM plazas
            WHERE activa = TRUE
            GROUP BY tipo
        `;
        const disponibilidad = await db.query(sql);

        res.json({
            success: true,
            data: {
                disponibilidad,
            },
        });
    } catch (error) {
        console.error('Error al consultar estado del parqueadero:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener disponibilidad de plazas',
            error: error.message,
        });
    }
}

module.exports = {
    obtenerMisVehiculos,
    obtenerMiHistorial,
    verEstadoParqueadero,
};
