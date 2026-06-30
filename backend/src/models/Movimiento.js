/**
 * Modelo de Movimiento
 *
 * Maneja los registros de entrada y salida
 * de vehículos en el parqueadero.
 * Incluye cálculo de tiempos y tarifas.
 */

const db = require('../config/database');

class Movimiento {
    /**
     * Registrar entrada de vehículo
     * @param {Object} datos - { vehiculo_id, plaza_id, usuario_registro_id }
     * @returns {Promise<Object>} Movimiento creado
     */
    static async registrarEntrada(datos) {
        const { vehiculo_id, plaza_id, usuario_registro_id } = datos;

        // Iniciar transacción para asegurar consistencia
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            // Verificar que la plaza esté libre
            const [plaza] = await connection.execute(
                'SELECT estado, tarifa_por_hora FROM plazas WHERE id = ?',
                [plaza_id]
            );

            if (!plaza[0]) {
                throw new Error('Plaza no encontrada');
            }

            if (plaza[0].estado !== 'libre') {
                throw new Error('La plaza no está disponible');
            }

            // Registrar el movimiento de entrada
            const sqlEntrada = `
                INSERT INTO movimientos
                (vehiculo_id, plaza_id, usuario_registro_id, tipo_movimiento, fecha_entrada, estado)
                VALUES (?, ?, ?, 'entrada', NOW(), 'en_parqueadero')
            `;

            const resultado = await connection.execute(sqlEntrada, [
                vehiculo_id,
                plaza_id,
                usuario_registro_id,
            ]);

            // Actualizar estado de la plaza a ocupada
            await connection.execute(
                'UPDATE plazas SET estado = "ocupada" WHERE id = ?',
                [plaza_id]
            );

            await connection.commit();

            // Obtener el movimiento completo con datos relacionados
            const movimiento = await this.obtenerPorId(resultado[0].insertId);

            return movimiento;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    /**
     * Registrar salida de vehículo
     * @param {number} movimientoId - ID del movimiento de entrada
     * @param {Object} datos - { metodo_pago, notas? }
     * @returns {Promise<Object>} Movimiento actualizado con total
     */
    static async registrarSalida(movimientoId, datos) {
        const { metodo_pago, notas } = datos;

        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            // Obtener movimiento actual
            const [movimientos] = await connection.execute(
                `SELECT m.*, p.tarifa_por_hora
                 FROM movimientos m
                 JOIN plazas p ON m.plaza_id = p.id
                 WHERE m.id = ? AND m.estado = 'en_parqueadero'`,
                [movimientoId]
            );

            if (!movimientos[0]) {
                throw new Error('Movimiento no encontrado o ya finalizado');
            }

            const movimiento = movimientos[0];

            // Calcular tiempo transcurrido y total a pagar
            const fechaEntrada = new Date(movimiento.fecha_entrada);
            const fechaSalida = new Date();
            const horasTranscurridas = this.calcularHoras(fechaEntrada, fechaSalida);

            // Calcular tarifa (mínimo 1 hora)
            const horasCobrar = Math.max(1, Math.ceil(horasTranscurridas));
            const totalPagar = horasCobrar * parseFloat(movimiento.tarifa_por_hora);

            // Actualizar movimiento con datos de salida
            const sqlActualizacion = `
                UPDATE movimientos
                SET
                    fecha_salida = NOW(),
                    estado = 'finalizado',
                    total_pagar = ?,
                    tarifa_aplicada = ?,
                    metodo_pago = ?,
                    notas = ?
                WHERE id = ?
            `;

            await connection.execute(sqlActualizacion, [
                totalPagar,
                movimiento.tarifa_por_hora,
                metodo_pago,
                notas || null,
                movimientoId,
            ]);

            // Liberar plaza
            await connection.execute(
                'UPDATE plazas SET estado = "libre" WHERE id = ?',
                [movimiento.plaza_id]
            );

            await connection.commit();

            // Retornar movimiento actualizado
            return {
                ...movimiento,
                fecha_salida: fechaSalida,
                horas_transcurridas: horasTranscurridas,
                total_pagar,
                metodo_pago,
            };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    /**
     * Calcular horas entre dos fechas
     * @param {Date} fechaInicio - Fecha de entrada
     * @param {Date} fechaFin - Fecha de salida
     * @returns {number} Horas transcurridas
     */
    static calcularHoras(fechaInicio, fechaFin) {
        const diferenciaMs = fechaFin - fechaInicio;
        return diferenciaMs / (1000 * 60 * 60);  // Convertir ms a horas
    }

    /**
     * Obtener movimientos en parqueadero (vehículos actuales)
     * @returns {Promise<Array>} Lista de vehículos actualmente en el parqueadero
     */
    static async obtenerEnParqueadero() {
        const sql = `
            SELECT
                m.id as movimiento_id,
                m.fecha_entrada,
                m.estado,
                p.nombre as plaza_nombre,
                p.tipo as plaza_tipo,
                v.placa,
                v.tipo as vehiculo_tipo,
                v.marca,
                v.modelo,
                v.color,
                u.nombre as usuario_registro
            FROM movimientos m
            JOIN plazas p ON m.plaza_id = p.id
            JOIN vehiculos v ON m.vehiculo_id = v.id
            JOIN usuarios u ON m.usuario_registro_id = u.id
            WHERE m.estado = 'en_parqueadero'
            ORDER BY m.fecha_entrada DESC
        `;

        return await db.query(sql);
    }

    /**
     * Obtener histórico de movimientos
     * @param {Object} filtros - { fecha_desde?, fecha_hasta?, placa?, estado? }
     * @returns {Promise<Array>} Lista de movimientos
     */
    static async obtenerHistorico(filtros = {}) {
        const { fecha_desde, fecha_hasta, placa, estado } = filtros;

        let sql = `
            SELECT
                m.*,
                p.nombre as plaza_nombre,
                v.placa,
                v.tipo as vehiculo_tipo,
                u.nombre as usuario_registro
            FROM movimientos m
            JOIN plazas p ON m.plaza_id = p.id
            JOIN vehiculos v ON m.vehiculo_id = v.id
            JOIN usuarios u ON m.usuario_registro_id = u.id
            WHERE 1=1
        `;

        const params = [];

        if (fecha_desde) {
            sql += ' AND m.fecha_entrada >= ?';
            params.push(`${fecha_desde} 00:00:00`);
        }

        if (fecha_hasta) {
            sql += ' AND m.fecha_entrada <= ?';
            params.push(`${fecha_hasta} 23:59:59`);
        }

        if (placa) {
            sql += ' AND v.placa LIKE ?';
            params.push(`%${placa}%`);
        }

        if (estado) {
            sql += ' AND m.estado = ?';
            params.push(estado);
        }

        sql += ' ORDER BY m.fecha_entrada DESC LIMIT 100';

        return await db.query(sql, params);
    }

    /**
     * Obtener movimiento por ID
     * @param {number} id - ID del movimiento
     * @returns {Promise<Object|null>} Movimiento o null
     */
    static async obtenerPorId(id) {
        const sql = `
            SELECT
                m.*,
                p.nombre as plaza_nombre,
                v.placa,
                v.tipo as vehiculo_tipo,
                u.nombre as usuario_registro
            FROM movimientos m
            JOIN plazas p ON m.plaza_id = p.id
            JOIN vehiculos v ON m.vehiculo_id = v.id
            JOIN usuarios u ON m.usuario_registro_id = u.id
            WHERE m.id = ?
        `;

        const resultados = await db.query(sql, [id]);
        return resultados[0] || null;
    }

    /**
     * Obtener estadísticas del día
     * @returns {Promise<Object>} Estadísticas diarias
     */
    static async obtenerEstadisticasDia() {
        const sql = `
            SELECT
                COUNT(*) as total_movimientos,
                COUNT(CASE WHEN tipo_movimiento = 'entrada' THEN 1 END) as entradas,
                COUNT(CASE WHEN tipo_movimiento = 'salida' THEN 1 END) as salidas,
                COALESCE(SUM(CASE WHEN estado = 'finalizado' THEN total_pagar END), 0) as recaudado_hoy
            FROM movimientos
            WHERE DATE(fecha_entrada) = CURDATE()
        `;

        const resultados = await db.query(sql);
        return resultados[0];
    }

    /**
     * Obtener estadísticas generales
     * @returns {Promise<Object>} Estadísticas del parqueadero
     */
    static async obtenerEstadisticasGenerales() {
        const sql = `
            SELECT
                (SELECT COUNT(*) FROM plazas WHERE estado = 'libre' AND activa = TRUE) as plazas_libres,
                (SELECT COUNT(*) FROM plazas WHERE estado = 'ocupada') as plazas_ocupadas,
                (SELECT COUNT(*) FROM plazas WHERE activa = TRUE) as plazas_totales,
                (SELECT COUNT(*) FROM movimientos WHERE DATE(fecha_entrada) = CURDATE()) as movimientos_hoy,
                (SELECT COALESCE(SUM(total_pagar), 0) FROM movimientos
                 WHERE DATE(fecha_salida) = CURDATE() AND estado = 'finalizado') as recaudado_hoy
        `;

        const resultados = await db.query(sql);
        return resultados[0];
    }
}

module.exports = Movimiento;
