/**
 * Enrutador principal de la API
 *
 * Centraliza todas las rutas de la aplicación
 * y aplica los middlewares de autenticación correspondientes.
 */

const express = require('express');
const router = express.Router();

// Importar controladores
const authController = require('../controllers/authController');
const usuariosController = require('../controllers/usuariosController');
const vehiculosController = require('../controllers/vehiculosController');
const movimientosController = require('../controllers/movimientosController');
const plazasController = require('../controllers/plazasController');

// Importar middlewares de autenticación y validación
const { verificarAuth, verificarRol } = require('../middlewares/auth');
const {
    validarRegistro,
    validarLogin,
    validarRegistroVehiculo,
    validarRegistroEntrada,
    validarRegistroSalida,
    validarCrearUsuario,
    validarActualizarUsuario,
    validarCrearPlaza,
} = require('../middlewares/validaciones');

// ============================================
// RUTAS PÚBLICAS (Sin autenticación)
// ============================================

// Auth
router.post('/auth/registro', validarRegistro, authController.registro);
router.post('/auth/login', validarLogin, authController.login);

// ============================================
// RUTAS PRIVADAS (Requieren autenticación)
// ============================================

// Perfil del usuario autenticado
router.get('/auth/perfil', verificarAuth, authController.obtenerPerfil);
router.put('/auth/perfil', verificarAuth, authController.actualizarPerfil);

// ============================================
// RUTAS DE USUARIOS (Solo Admin)
// ============================================

router.use('/usuarios', verificarAuth, verificarRol('admin'));

router.get('/usuarios', usuariosController.listarUsuarios);
router.get('/usuarios/:id', usuariosController.obtenerUsuario);
router.post('/usuarios', validarCrearUsuario, usuariosController.crearUsuario);
router.put('/usuarios/:id', validarActualizarUsuario, usuariosController.actualizarUsuario);
router.delete('/usuarios/:id', usuariosController.eliminarUsuario);

// ============================================
// RUTAS DE VEHÍCULOS (Admin y Empleado)
// ============================================

router.use('/vehiculos', verificarAuth);

router.post('/vehiculos', validarRegistroVehiculo, vehiculosController.registrarVehiculo);
router.get('/vehiculos/placa/:placa', vehiculosController.buscarPorPlaca);
router.get('/vehiculos/historial', vehiculosController.obtenerHistorial);
router.put('/vehiculos/:id', vehiculosController.actualizarVehiculo);

// ============================================
// RUTAS DE MOVIMIENTOS (Admin y Empleado)
// ============================================

router.use('/movimientos', verificarAuth);

router.post('/movimientos/entrada', validarRegistroEntrada, movimientosController.registrarEntrada);
router.post('/movimientos/salida/:id', validarRegistroSalida, movimientosController.registrarSalida);
router.get('/movimientos/en-parqueadero', movimientosController.obtenerEnParqueadero);
router.get('/movimientos/historico', movimientosController.obtenerHistorico);
router.get('/movimientos/estadisticas', movimientosController.obtenerEstadisticas);
router.get('/movimientos/calcular-costo/:id', movimientosController.calcularCosto);

// ============================================
// RUTAS DE PLAZAS
// ============================================

router.use('/plazas', verificarAuth);

// Todas las rutas de plazas son de lectura para empleados
router.get('/plazas', plazasController.listarPlazas);
router.get('/plazas/disponibles', plazasController.listarDisponibles);
router.get('/plazas/:id', plazasController.obtenerPlaza);

// Solo admin puede modificar plazas
router.post('/plazas', verificarRol('admin'), validarCrearPlaza, plazasController.crearPlaza);
router.put('/plazas/:id', verificarRol('admin'), plazasController.actualizarPlaza);
router.delete('/plazas/:id', verificarRol('admin'), plazasController.eliminarPlaza);

// ============================================
// RUTA DE TEST (Health check)
// ============================================

router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API funcionando correctamente',
        timestamp: new Date().toISOString(),
    });
});

// ============================================
// RUTA POR DEFECTO (404)
// ============================================

router.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada',
    });
});

module.exports = router;
