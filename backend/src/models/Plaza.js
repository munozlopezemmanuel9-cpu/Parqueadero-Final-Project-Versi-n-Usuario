/**
 * Modelo de Plaza
 *
 * Maneja las operaciones relacionadas con
 * las plazas/espacios del parqueadero
 */

const db = require('../config/database');

class Plaza {
    /**
     * Crear nueva plaza
     * @param {Object} datos - { nombre, tipo, tarifa_por_hora }
     * @returns {Promise<Object>} Plaza creada
     */
    static async crear(datos) {
        const { nombre, tipo = 'carro', tarifa_por_hora = 5000 } = datos;

        const sql = `
            INSERT INTO plazas (nombre, tipo, tarifa_por_hora)
            VALUES (?, ?, ?)
        `;

        const resultado = await db.query(sql, [nombre, tipo, tarifa_por_hora]);

        return {
            id: resultado.insertId,
            nombre,
            tipo,
            tarifa_por_hora,
            estado: 'libre',
        };
    }

    /**
     * Obtener todas las plazas
     * @returns {Promise<Array>} Lista de plazas
     */
    static async obtenerTodas() {
        const sql = `
            SELECT * FROM plazas
            WHERE activa = TRUE
            ORDER BY
                FIELD(tipo, 'carro', 'camioneta', 'moto', 'discapacitado'),
                nombre
        `;

        return await db.query(sql);
    }

    /**
     * Obtener plazas por estado
     * @param {string} estado - 'libre', 'ocupada', 'mantenimiento'
     * @returns {Promise<Array>} Plazas filtradas
     */
    static async obtenerPorEstado(estado) {
        const sql = 'SELECT * FROM plazas WHERE estado = ? AND activa = TRUE ORDER BY nombre';
        return await db.query(sql, [estado]);
    }

    /**
     * Obtener plazas disponibles por tipo
     * @param {string} tipo - Tipo de vehículo
     * @returns {Promise<Array>} Plazas disponibles
     */
    static async obtenerDisponiblesPorTipo(tipo) {
        // Si es camioneta, también puede usar plazas de carro
        const tiposPermitidos = tipo === 'camioneta' ? ['carro', 'camioneta'] : [tipo];

        const sql = `
            SELECT * FROM plazas
            WHERE estado = 'libre' AND activa = TRUE AND tipo IN (?)
            ORDER BY nombre
        `;

        return await db.query(sql, [tiposPermitidos]);
    }

    /**
     * Buscar plaza por ID
     * @param {number} id - ID de la plaza
     * @returns {Promise<Object|null>} Plaza o null
     */
    static async buscarPorId(id) {
        const sql = 'SELECT * FROM plazas WHERE id = ?';
        const resultados = await db.query(sql, [id]);
        return resultados[0] || null;
    }

    /**
     * Actualizar estado de plaza
     * @param {number} id - ID de la plaza
     * @param {string} estado - Nuevo estado
     * @returns {Promise<Object>} Resultado
     */
    static async actualizarEstado(id, estado) {
        const sql = 'UPDATE plazas SET estado = ? WHERE id = ?';
        const resultado = await db.query(sql, [estado, id]);
        return { affectedRows: resultado.affectedRows };
    }

    /**
     * Actualizar plaza completa
     * @param {number} id - ID de la plaza
     * @param {Object} datos - Datos a actualizar
     * @returns {Promise<Object>} Resultado
     */
    static async actualizar(id, datos) {
        const { nombre, tipo, tarifa_por_hora, estado } = datos;

        const campos = [];
        const valores = [];

        if (nombre) {
            campos.push('nombre = ?');
            valores.push(nombre);
        }
        if (tipo) {
            campos.push('tipo = ?');
            valores.push(tipo);
        }
        if (tarifa_por_hora) {
            campos.push('tarifa_por_hora = ?');
            valores.push(tarifa_por_hora);
        }
        if (estado) {
            campos.push('estado = ?');
            valores.push(estado);
        }

        if (campos.length === 0) {
            throw new Error('No se proporcionaron campos para actualizar');
        }

        valores.push(id);

        const sql = `UPDATE plazas SET ${campos.join(', ')} WHERE id = ?`;
        const resultado = await db.query(sql, valores);

        return { affectedRows: resultado.affectedRows };
    }

    /**
     * Desactivar plaza (soft delete)
     * @param {number} id - ID de la plaza
     * @returns {Promise<Object>} Resultado
     */
    static async desactivar(id) {
        const sql = 'UPDATE plazas SET activa = FALSE WHERE id = ?';
        const resultado = await db.query(sql, [id]);
        return { affectedRows: resultado.affectedRows };
    }
}

module.exports = Plaza;
