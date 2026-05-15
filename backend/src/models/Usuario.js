/**
 * Modelo de Usuario
 *
 * Maneja todas las operaciones relacionadas con usuarios
 * en la base de datos. Usa bcrypt para hashear contraseñas
 * y JWT para tokens de autenticación.
 */

const bcrypt = require('bcryptjs');
const db = require('../config/database');

class Usuario {
    /**
     * Crear un nuevo usuario
     * @param {Object} datos - { nombre, email, password, rol }
     * @returns {Promise<Object>} Usuario creado (sin password)
     */
    static async crear(datos) {
        const { nombre, email, password, rol = 'empleado' } = datos;

        // Hashear la contraseña con bcrypt (10 rondas de salt)
        const passwordHash = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO usuarios (nombre, email, password_hash, rol)
            VALUES (?, ?, ?, ?)
        `;

        const resultado = await db.query(sql, [nombre, email, passwordHash, rol]);

        // Retornar datos del usuario sin el password
        return {
            id: resultado.insertId,
            nombre,
            email,
            rol,
        };
    }

    /**
     * Buscar usuario por email
     * @param {string} email - Email del usuario
     * @returns {Promise<Object|null>} Usuario o null si no existe
     */
    static async buscarPorEmail(email) {
        const sql = 'SELECT * FROM usuarios WHERE email = ?';
        const resultados = await db.query(sql, [email]);

        return resultados[0] || null;
    }

    /**
     * Buscar usuario por ID
     * @param {number} id - ID del usuario
     * @returns {Promise<Object|null>} Usuario o null si no existe
     */
    static async buscarPorId(id) {
        const sql = 'SELECT id, nombre, email, rol, activo, creado_en FROM usuarios WHERE id = ?';
        const resultados = await db.query(sql, [id]);

        return resultados[0] || null;
    }

    /**
     * Verificar credenciales de login
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña en texto plano
     * @returns {Promise<Object|null>} Usuario si es válido, null si no
     */
    static async verificarCredenciales(email, password) {
        // Buscar usuario incluyendo el hash de contraseña
        const usuario = await this.buscarPorEmail(email);

        if (!usuario) {
            return null;
        }

        // Verificar si el usuario está activo
        if (!usuario.activo) {
            return null;
        }

        // Comparar password proporcionado con el hash almacenado
        const passwordValido = await bcrypt.compare(password, usuario.password_hash);

        if (!passwordValido) {
            return null;
        }

        // Retornar usuario sin datos sensibles
        const { password_hash, ...usuarioSinPassword } = usuario;
        return usuarioSinPassword;
    }

    /**
     * Obtener todos los usuarios
     * @returns {Promise<Array>} Lista de usuarios
     */
    static async obtenerTodos() {
        const sql = `
            SELECT id, nombre, email, rol, activo, creado_en
            FROM usuarios
            ORDER BY creado_en DESC
        `;
        return await db.query(sql);
    }

    /**
     * Actualizar usuario
     * @param {number} id - ID del usuario
     * @param {Object} datos - Datos a actualizar
     * @returns {Promise<Object>} Resultado de la actualización
     */
    static async actualizar(id, datos) {
        const { nombre, email, rol, activo, password } = datos;

        // Construir dinámica del query solo con campos proporcionados
        const campos = [];
        const valores = [];

        if (nombre) {
            campos.push('nombre = ?');
            valores.push(nombre);
        }
        if (email) {
            campos.push('email = ?');
            valores.push(email);
        }
        if (rol) {
            campos.push('rol = ?');
            valores.push(rol);
        }
        if (activo !== undefined) {
            campos.push('activo = ?');
            valores.push(activo);
        }
        if (password) {
            const passwordHash = await bcrypt.hash(password, 10);
            campos.push('password_hash = ?');
            valores.push(passwordHash);
        }

        if (campos.length === 0) {
            throw new Error('No se proporcionaron campos para actualizar');
        }

        valores.push(id);

        const sql = `UPDATE usuarios SET ${campos.join(', ')} WHERE id = ?`;
        const resultado = await db.query(sql, valores);

        return { affectedRows: resultado.affectedRows };
    }

    /**
     * Eliminar usuario (soft delete - desactivar)
     * @param {number} id - ID del usuario
     * @returns {Promise<Object>} Resultado de la eliminación
     */
    static async eliminar(id) {
        // Usamos soft delete (desactivar) en lugar de eliminar físicamente
        // para mantener el histórico de movimientos
        const sql = 'UPDATE usuarios SET activo = FALSE WHERE id = ?';
        const resultado = await db.query(sql, [id]);

        return { affectedRows: resultado.affectedRows };
    }
}

module.exports = Usuario;
