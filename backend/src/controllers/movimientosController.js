/**
 * Controlador de Movimientos
 *
 * Maneja los registros de entrada y salida
 * de vehículos en el parqueadero.
 */

const Movimiento = require('../models/Movimiento');
const Vehiculo = require('../models/Vehiculo');
const Plaza = require('../models/Plaza');

/**
 * Registrar entrada de vehículo
 *
 * @route POST /api/movimientos/entrada
 * @access Privado
 */
async function registrarEntrada(req, res) {
    try {
        const { vehiculo_id, plaza_id } = req.body;
        const usuario_registro_id = req.usuario.id;

        // Verificar que el vehículo existe
        const vehiculo = await Vehiculo.buscarPorId(vehiculo_id);
        if (!vehiculo) {
            return res.status(404).json({
                success: false,
                message: 'Vehículo no encontrado',
            });
        }

        // Verificar que la plaza existe y está disponible
        const plaza = await Plaza.buscarPorId(plaza_id);
        if (!plaza) {
            return res.status(404).json({
                success: false,
                message: 'Plaza no encontrada',
            });
        }

        if (plaza.estado !== 'libre') {
            return res.status(400).json({
                success: false,
                message: `La plaza ${plaza.nombre} está ${plaza.estado}`,
            });
        }

        // Verificar compatibilidad de tipo (opcional, se puede hacer más flexible)
        if (plaza.tipo === 'moto' && vehiculo.tipo !== 'moto') {
            return res.status(400).json({
                success: false,
                message: 'Esta plaza es exclusiva para motos',
            });
        }

        const movimiento = await Movimiento.registrarEntrada({
            vehiculo_id,
            plaza_id,
            usuario_registro_id,
        });

        res.status(201).json({
            success: true,
            message: 'Entrada registrada exitosamente',
            data: {
                movimiento,
            },
        });
    } catch (error) {
        console.error('Error al registrar entrada:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar entrada',
            error: error.message,
        });
    }
}

/**
 * Registrar salida de vehículo
 *
 * @route POST /api/movimientos/salida/:id
 * @access Privado
 */
async function registrarSalida(req, res) {
    try {
        const { id } = req.params;
        const { metodo_pago, notas } = req.body;

        const resultado = await Movimiento.registrarSalida(id, {
            metodo_pago,
            notas,
        });

        res.json({
            success: true,
            message: 'Salida registrada exitosamente',
            data: {
                movimiento: resultado,
            },
        });
    } catch (error) {
        console.error('Error al registrar salida:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar salida',
            error: error.message,
        });
    }
}

/**
 * Obtener vehículos en parqueadero
 *
 * @route GET /api/movimientos/en-parqueadero
 * @access Privado
 */
async function obtenerEnParqueadero(req, res) {
    try {
        const movimientos = await Movimiento.obtenerEnParqueadero();

        res.json({
            success: true,
            data: {
                movimientos,
            },
        });
    } catch (error) {
        console.error('Error al obtener vehículos en parqueadero:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener vehículos en parqueadero',
            error: error.message,
        });
    }
}

/**
 * Obtener histórico de movimientos
 *
 * @route GET /api/movimientos/historico
 * @access Privado
 */
async function obtenerHistorico(req, res) {
    try {
        const { fecha_desde, fecha_hasta, placa, estado } = req.query;

        const filtros = {};
        if (fecha_desde) filtros.fecha_desde = fecha_desde;
        if (fecha_hasta) filtros.fecha_hasta = fecha_hasta;
        if (placa) filtros.placa = placa;
        if (estado) filtros.estado = estado;

        const movimientos = await Movimiento.obtenerHistorico(filtros);

        res.json({
            success: true,
            data: {
                movimientos,
            },
        });
    } catch (error) {
        console.error('Error al obtener histórico:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener histórico',
            error: error.message,
        });
    }
}

/**
 * Obtener estadísticas del día
 *
 * @route GET /api/movimientos/estadisticas
 * @access Privado
 */
async function obtenerEstadisticas(req, res) {
    try {
        const estadisticasDia = await Movimiento.obtenerEstadisticasDia();
        const estadisticasGenerales = await Movimiento.obtenerEstadisticasGenerales();

        res.json({
            success: true,
            data: {
                dia: estadisticasDia,
                general: estadisticasGenerales,
            },
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas',
            error: error.message,
        });
    }
}

/**
 * Calcular costo estimado para vehículo en parqueadero
 *
 * @route GET /api/movimientos/calcular-costo/:id
 * @access Privado
 */
async function calcularCosto(req, res) {
    try {
        const { id } = req.params;

        const movimiento = await Movimiento.obtenerPorId(id);

        if (!movimiento) {
            return res.status(404).json({
                success: false,
                message: 'Movimiento no encontrado',
            });
        }

        if (movimiento.estado !== 'en_parqueadero') {
            return res.status(400).json({
                success: false,
                message: 'Este movimiento ya está finalizado',
            });
        }

        const fechaEntrada = new Date(movimiento.fecha_entrada);
        const fechaActual = new Date();
        const horasTranscurridas = Movimiento.calcularHoras(fechaEntrada, fechaActual);
        const horasCobrar = Math.max(1, Math.ceil(horasTranscurridas));
        const costoEstimado = horasCobrar * parseFloat(movimiento.tarifa_aplicada || movimiento.tarifa_por_hora);

        res.json({
            success: true,
            data: {
                movimiento_id: id,
                placa: movimiento.placa,
                fecha_entrada: movimiento.fecha_entrada,
                horas_transcurridas: horasTranscurridas.toFixed(2),
                horas_cobrar: horasCobrar,
                costo_estimado: costoEstimado,
            },
        });
    } catch (error) {
        console.error('Error al calcular costo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al calcular costo',
            error: error.message,
        });
    }
}

module.exports = {
    registrarEntrada,
    registrarSalida,
    obtenerEnParqueadero,
    obtenerHistorico,
    obtenerEstadisticas,
    calcularCosto,
};
