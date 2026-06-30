/**
 * Servidor Principal de la API GPA Parqueadero
 *
 * Este archivo configura y arranca el servidor Express
 * con todos los middlewares y rutas necesarias.
 *
 * @author Equipo de Desarrollo
 * @version 2.0.0
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
require('dotenv').config();

// Importar configuración de base de datos
const { verificarConexion } = require('./config/database');
const {
  generalLimiter,
  loginLimiter,
  registerLimiter,
  sanitizeInput,
  securityLogger,
} = require('./config/security');

// Importar enrutador principal
const routes = require('./routes');

// ============================================
// CONFIGURACIÓN DEL SERVIDOR
// ============================================

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARES GLOBALES
// ============================================

// Helmet: Agrega cabeceras de seguridad HTTP
app.use(helmet());

// Rate limiting general
app.use(generalLimiter);

// Security logger
app.use(securityLogger);

// Sanitización de inputs
app.use(sanitizeInput);

// CORS: Permite solicitudes desde el frontend
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Logging de solicitudes (solo en desarrollo)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Parsear cuerpos de solicitudes JSON
app.use(express.json());

// Parsear cuerpos de solicitudes URL-encoded
app.use(express.urlencoded({ extended: true }));

// ============================================
// RUTAS DE LA API
// ============================================

// Montar todas las rutas bajo /api
app.use('/api', routes);

// Ruta raíz - información de la API
app.get('/', (req, res) => {
    res.json({
        nombre: 'GPA Parqueadero API',
        version: '1.0.0',
        descripcion: 'Sistema de gestión de parqueadero',
        endpoints: {
            auth: '/api/auth',
            usuarios: '/api/usuarios',
            vehiculos: '/api/vehiculos',
            movimientos: '/api/movimientos',
            plazas: '/api/plazas',
        },
    });
});

// ============================================
// MANEJO DE ERRORES GLOBAL
// ============================================

// Middleware para manejar errores no capturados
app.use((err, req, res, next) => {
    console.error('Error no capturado:', err);

    // Error 404 si la ruta no existe
    if (err.status === 404) {
        return res.status(404).json({
            success: false,
            message: 'Recurso no encontrado',
        });
    }

    // Error de base de datos
    if (err.code === 'ER_NO_REFERENCED_ROW' || err.code === 'ER_FOREIGN_KEY_CONSTRAINT') {
        return res.status(400).json({
            success: false,
            message: 'Error de integridad de datos',
        });
    }

    // Error por defecto (500)
    res.status(err.status || 500).json({
        success: false,
        message: process.env.NODE_ENV === 'development'
            ? err.message
            : 'Error interno del servidor',
    });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

/**
 * Función asíncrona para iniciar el servidor
 *
 * Verifica primero la conexión a la base de datos
 * y luego arranca el servidor HTTP.
 */
async function iniciarServidor() {
    try {
        // Verificar conexión a la base de datos
        const dbConectada = await verificarConexion();

        if (!dbConectada) {
            console.error('\n⚠️  El servidor no puede iniciar sin conexión a la base de datos');
            console.error('   Por favor verifica la configuración en .env');
            process.exit(1);
        }

        // Iniciar servidor HTTP
        app.listen(PORT, () => {
            console.log('\n' + '='.repeat(50));
            console.log('🚀 SERVIDOR INICIADO');
            console.log('='.repeat(50));
            console.log(`   Ambiente: ${process.env.NODE_ENV || 'development'}`);
            console.log(`   Puerto: ${PORT}`);
            console.log(`   URL: http://localhost:${PORT}`);
            console.log(`   API: http://localhost:${PORT}/api`);
            console.log('='.repeat(50));
            console.log('\n📋 Endpoints disponibles:');
            console.log('   POST   /api/auth/login       - Iniciar sesión');
            console.log('   POST   /api/auth/registro    - Registrar usuario');
            console.log('   GET    /api/usuarios         - Listar usuarios (Admin)');
            console.log('   POST   /api/movimientos/entrada  - Registrar entrada');
            console.log('   POST   /api/movimientos/salida/:id - Registrar salida');
            console.log('   GET    /api/plazas           - Listar plazas');
            console.log('   GET    /api/vehiculos/historial  - Historial vehículos');
            console.log('\n' + '='.repeat(50) + '\n');
        });

    } catch (error) {
        console.error('❌ Error fatal al iniciar el servidor:', error);
        process.exit(1);
    }
}

// ============================================
// MANEJO DE SEÑALES (Shutdown graceful)
// ============================================

// Manejar cierre SIGTERM (ej: heroku, docker)
process.on('SIGTERM', () => {
    console.log('\n📡 Señal SIGTERM recibida, cerrando servidor...');
    process.exit(0);
});

// Manejar cierre SIGINT (Ctrl+C)
process.on('SIGINT', () => {
    console.log('\n📡 Señal SIGINT recibida, cerrando servidor...');
    process.exit(0);
});

// Iniciar servidor
iniciarServidor();

module.exports = app;
