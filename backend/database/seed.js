/**
 * Script para insertar datos de prueba en la base de datos
 *
 * Este script crea usuarios con contraseñas hasheadas correctamente
 * usando bcrypt, ya que los hashes hardcodeados en el SQL no son válidos.
 *
 * Uso: node database/seed.js
 */

const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

// Configuración de conexión
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',  // Cambia esto si tienes contraseña
    database: 'gpa_parqueadero',
    port: 3306,
};

async function seed() {
    let connection;

    try {
        // Conectar a la base de datos
        console.log('📡 Conectando a la base de datos...');
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Conectado exitosamente');

        // Generar hashes de contraseñas
        console.log('\n🔐 Generando hashes de contraseñas...');
        const hashAdmin = await bcrypt.hash('admin123', 10);
        const hashEmpleado = await bcrypt.hash('empleado123', 10);
        console.log('   Hash admin:', hashAdmin);
        console.log('   Hash empleado:', hashEmpleado);

        // Eliminar usuarios existentes (para evitar duplicados)
        console.log('\n🗑️  Limpiando usuarios existentes...');
        await connection.execute('DELETE FROM usuarios WHERE email IN (?, ?)', [
            'admin@gpa.com',
            'empleado@gpa.com',
        ]);

        // Insertar usuarios de prueba
        console.log('\n👥 Insertando usuarios de prueba...');
        await connection.execute(
            `INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)`,
            ['Administrador Principal', 'admin@gpa.com', hashAdmin, 'admin']
        );
        await connection.execute(
            `INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)`,
            ['Empleado Ejemplo', 'empleado@gpa.com', hashEmpleado, 'empleado']
        );

        console.log('✅ Usuarios insertados exitosamente');

        // Mostrar resumen
        console.log('\n📋 CREDENCIALES DE PRUEBA:');
        console.log('='.repeat(50));
        console.log('\n🔑 ADMINISTRADOR:');
        console.log('   Email: admin@gpa.com');
        console.log('   Contraseña: admin123');
        console.log('\n🔑 EMPLEADO:');
        console.log('   Email: empleado@gpa.com');
        console.log('   Contraseña: empleado123');
        console.log('\n' + '='.repeat(50));

        // Verificar plazas existentes
        console.log('\n🅿️  Verificando plazas...');
        const [plazas] = await connection.execute('SELECT COUNT(*) as total FROM plazas');
        if (plazas[0].total === 0) {
            console.log('   Insertando plazas de prueba...');
            await connection.execute(`
                INSERT INTO plazas (nombre, tipo, tarifa_por_hora) VALUES
                ('A-01', 'carro', 5000),
                ('A-02', 'carro', 5000),
                ('A-03', 'carro', 5000),
                ('A-04', 'carro', 5000),
                ('A-05', 'carro', 5000),
                ('A-06', 'carro', 5000),
                ('A-07', 'carro', 5000),
                ('A-08', 'carro', 5000),
                ('M-01', 'moto', 2000),
                ('M-02', 'moto', 2000),
                ('M-03', 'moto', 2000),
                ('M-04', 'moto', 2000),
                ('C-01', 'camioneta', 7000),
                ('C-02', 'camioneta', 7000),
                ('D-01', 'discapacitado', 4000),
                ('D-02', 'discapacitado', 4000)
            `);
            console.log('   ✅ 16 plazas insertadas');
        } else {
            console.log(`   ✅ ${plazas[0].total} plazas existentes`);
        }

        console.log('\n✨ ¡Seed completado exitosamente!\n');

    } catch (error) {
        console.error('\n❌ Error durante el seed:', error.message);
        console.log('\n💡 Asegúrate de:');
        console.log('   1. MySQL esté ejecutándose');
        console.log('   2. La base de datos gpa_parqueadero exista');
        console.log('   3. Las credenciales en este script sean correctas');
        console.log('   4. Haber ejecutado schema.sql primero\n');
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Ejecutar seed
seed();
