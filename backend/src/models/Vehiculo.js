/**
 * Modelo de Vehículo
 *
 * Maneja las operaciones CRUD de vehículos
 * que ingresan al parqueadero
 */

const db = require('../config/database');

class Vehiculo {
    /**
     * Crear o buscar vehículo por placa
     * Si el vehículo ya existe, lo retorna.
     * Si no, crea un nuevo registro.
     * @param {Object} datos - { placa, tipo, marca?, modelo?, color? }
     * @returns {Promise<Object>} Vehículo encontrado o creado
     */
    static async crearOBuscar(datos) {
        const { placa, tipo, marca, modelo, color } = datos;

        // Normalizar placa a mayúsculas
        const placaNormalizada = placa.toUpperCase().trim();

        // Buscar vehículo existente por placa
        const existente = await this.buscarPorPlaca(placaNormalizada);

        if (existente) {
            return existente;
        }

        // Crear nuevo vehículo
        const sql = `
            INSERT INTO vehiculos (placa, tipo, marca, modelo, color)
            VALUES (?, ?, ?, ?, ?)
        `;

        const resultado = await db.query(sql, [
            placaNormalizada,
            tipo || 'carro',
            marca || null,
            modelo || null,
            color || null,
        ]);

        return {
            id: resultado.insertId,
            placa: placaNormalizada,
            tipo: tipo || 'carro',
            marca,
            modelo,
            color,
        };
    }

    /**
     * Buscar vehículo por placa
     * @param {string} placa - Placa del vehículo
     * @returns {Promise<Object|null>} Vehículo o null
     */
    static async buscarPorPlaca(placa) {
        const sql = 'SELECT * FROM vehiculos WHERE placa = ?';
        const resultados = await db.query(sql, [placa.toUpperCase().trim()]);

        return resultados[0] || null;
    }

    /**
     * Buscar vehículo por ID
     * @param {number} id - ID del vehículo
     * @returns {Promise<Object|null>} Vehículo o null
     */
    static async buscarPorId(id) {
        const sql = 'SELECT * FROM vehiculos WHERE id = ?';
        const resultados = await db.query(sql, [id]);

        return resultados[0] || null;
    }

    /**
     * Obtener historial de vehículos
     * @returns {Promise<Array>} Lista de vehículos con sus movimientos
     */
    static async obtenerHistorial() {
        const sql = `
            SELECT
                v.*,
                COUNT(m.id) as total_visitas,
                MAX(m.fecha_entrada) as ultima_visita
            FROM vehiculos v
            LEFT JOIN movimientos m ON v.id = m.vehiculo_id
            GROUP BY v.id
            ORDER BY ultima_visita DESC
        `;

        return await db.query(sql);
    }

    /**
     * Actualizar vehículo
     * @param {number} id - ID del vehículo
     * @param {Object} datos - Datos a actualizar
     * @returns {Promise<Object>} Resultado
     */
    static async actualizar(id, datos) {
        const { marca, modelo, color, tipo } = datos;

        const campos = [];
        const valores = [];

        if (marca) {
            campos.push('marca = ?');
            valores.push(marca);
        }
        if (modelo) {
            campos.push('modelo = ?');
            valores.push(modelo);
        }
        if (color) {
            campos.push('color = ?');
            valores.push(color);
        }
        if (tipo) {
            campos.push('tipo = ?');
            valores.push(tipo);
        }

        if (campos.length === 0) {
            throw new Error('No se proporcionaron campos para actualizar');
        }

        valores.push(id);

        const sql = `UPDATE vehiculos SET ${campos.join(', ')} WHERE id = ?`;
        const resultado = await db.query(sql, valores);

        return { affectedRows: resultado.affectedRows };
    }
}

module.exports = Vehiculo;
