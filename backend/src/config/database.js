/**
 * Configuración de la conexión a la base de datos MySQL
 *
 * Este módulo establece y exporta una conexión (pool) a la base de datos
 * usando mysql2, que ofrece mejor rendimiento y soporte para promesas.
 *
 * El pool de conexiones permite manejar múltiples consultas simultáneas
 * de manera eficiente, reutilizando conexiones en lugar de crear una nueva
 * para cada consulta.
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuración de la conexión desde variables de entorno
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'gpa_parqueadero',
    port: process.env.DB_PORT || 3306,
    // Configuración del pool de conexiones
    waitForConnections: true,
    connectionLimit: 10,  // Máximo de conexiones simultáneas
    queueLimit: 0,        // Sin límite de cola
    // Timezone para manejar correctamente las fechas
    timezone: '-05:00',   // Ajustar según tu zona horaria (Colombia: -05:00)
};

/**
 * Crear el pool de conexiones
 *
 * Usamos un pool en lugar de una conexión única para:
 * - Mejor rendimiento con múltiples usuarios
 * - Reutilización de conexiones
 * - Manejo automático de reconexión
 */
const pool = mysql.createPool(dbConfig);

/**
 * Función para verificar la conexión a la base de datos
 *
 * Esta función se usa al iniciar el servidor para confirmar
 * que la base de datos está accesible.
 */
async function verificarConexion() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexión exitosa a la base de datos MySQL');
        console.log(`   Database: ${dbConfig.database}`);
        console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`);
        connection.release();  // Liberar la conexión de vuelta al pool
        return true;
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos:');
        console.error(`   ${error.message}`);
        console.log('\n💡 Verifica que:');
        console.log('   1. MySQL esté ejecutándose');
        console.log('   2. Las credenciales en .env sean correctas');
        console.log('   3. La base de datos exista (ejecuta schema.sql)');
        return false;
    }
}

/**
 * Función para ejecutar consultas
 *
 * Wrapper que simplifica la ejecución de consultas SQL
 * y maneja automáticamente la obtención y liberación de conexiones.
 *
 * @param {string} query - Consulta SQL con placeholders (?)
 * @param {Array} params - Parámetros para reemplazar los placeholders
 * @returns {Promise<Array>} Resultado de la consulta
 */
async function query(sql, params = []) {
    const [results] = await pool.execute(sql, params);
    return results;
}

/**
 * Función para obtener una conexión manual
 *
 * Útil cuando necesitas ejecutar múltiples consultas
 * dentro de una transacción.
 */
async function getConnection() {
    return await pool.getConnection();
}

// Exportar funciones y el pool para uso externo
module.exports = {
    pool,
    query,
    getConnection,
    verificarConexion,
};
