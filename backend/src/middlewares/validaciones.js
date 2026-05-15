/**
 * Validaciones comunes para rutas de la API
 *
 * Usa express-validator para validar y sanitizar
 * los datos de entrada de las solicitudes.
 */

const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware para manejar errores de validación
 *
 * Debe colocarse después de los middlewares de validación
 * en cada ruta.
 */
function manejarErroresValidacion(req, res, next) {
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errores: errores.array().map(err => ({
                campo: err.path,
                mensaje: err.msg,
            })),
        });
    }

    next();
}

// ============================================
// VALIDACIONES PARA AUTENTICACIÓN
// ============================================

const validarRegistro = [
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre es requerido')
        .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),

    body('email')
        .trim()
        .notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('El email no es válido')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

    body('rol')
        .optional()
        .isIn(['admin', 'empleado']).withMessage('El rol debe ser "admin" o "empleado"'),

    manejarErroresValidacion,
];

const validarLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('El email no es válido'),

    body('password')
        .notEmpty().withMessage('La contraseña es requerida'),

    manejarErroresValidacion,
];

// ============================================
// VALIDACIONES PARA VEHÍCULOS
// ============================================

const validarRegistroVehiculo = [
    body('placa')
        .trim()
        .notEmpty().withMessage('La placa es requerida')
        .isLength({ min: 6, max: 20 }).withMessage('La placa debe tener entre 6 y 20 caracteres')
        .toUpperCase(),

    body('tipo')
        .optional()
        .isIn(['moto', 'carro', 'camioneta', 'otro']).withMessage('Tipo de vehículo no válido'),

    body('marca')
        .optional()
        .trim()
        .isLength({ max: 50 }).withMessage('La marca no puede exceder 50 caracteres'),

    body('modelo')
        .optional()
        .trim()
        .isLength({ max: 50 }).withMessage('El modelo no puede exceder 50 caracteres'),

    body('color')
        .optional()
        .trim()
        .isLength({ max: 30 }).withMessage('El color no puede exceder 30 caracteres'),

    manejarErroresValidacion,
];

// ============================================
// VALIDACIONES PARA MOVIMIENTOS
// ============================================

const validarRegistroEntrada = [
    body('vehiculo_id')
        .notEmpty().withMessage('El ID del vehículo es requerido')
        .isInt({ min: 1 }).withMessage('El ID del vehículo debe ser un número positivo'),

    body('plaza_id')
        .notEmpty().withMessage('El ID de la plaza es requerido')
        .isInt({ min: 1 }).withMessage('El ID de la plaza debe ser un número positivo'),

    manejarErroresValidacion,
];

const validarRegistroSalida = [
    param('id')
        .notEmpty().withMessage('El ID del movimiento es requerido')
        .isInt({ min: 1 }).withMessage('El ID debe ser un número positivo'),

    body('metodo_pago')
        .notEmpty().withMessage('El método de pago es requerido')
        .isIn(['efectivo', 'tarjeta', 'transferencia', 'gratuito']).withMessage('Método de pago no válido'),

    body('notas')
        .optional()
        .isLength({ max: 500 }).withMessage('Las notas no pueden exceder 500 caracteres'),

    manejarErroresValidacion,
];

// ============================================
// VALIDACIONES PARA USUARIOS
// ============================================

const validarCrearUsuario = [
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre es requerido')
        .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),

    body('email')
        .trim()
        .notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('El email no es válido')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

    body('rol')
        .notEmpty().withMessage('El rol es requerido')
        .isIn(['admin', 'empleado']).withMessage('El rol debe ser "admin" o "empleado"'),

    manejarErroresValidacion,
];

const validarActualizarUsuario = [
    param('id')
        .notEmpty().withMessage('El ID del usuario es requerido')
        .isInt({ min: 1 }).withMessage('El ID debe ser un número positivo'),

    body('nombre')
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),

    body('email')
        .optional()
        .trim()
        .isEmail().withMessage('El email no es válido')
        .normalizeEmail(),

    body('rol')
        .optional()
        .isIn(['admin', 'empleado']).withMessage('El rol debe ser "admin" o "empleado"'),

    body('activo')
        .optional()
        .isBoolean().withMessage('El estado activo debe ser true o false'),

    manejarErroresValidacion,
];

// ============================================
// VALIDACIONES PARA PLAZAS
// ============================================

const validarCrearPlaza = [
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre de la plaza es requerido')
        .isLength({ max: 20 }).withMessage('El nombre no puede exceder 20 caracteres'),

    body('tipo')
        .optional()
        .isIn(['moto', 'carro', 'camioneta', 'discapacitado']).withMessage('Tipo de plaza no válido'),

    body('tarifa_por_hora')
        .optional()
        .isFloat({ min: 0 }).withMessage('La tarifa debe ser un número positivo'),

    manejarErroresValidacion,
];

module.exports = {
    manejarErroresValidacion,
    validarRegistro,
    validarLogin,
    validarRegistroVehiculo,
    validarRegistroEntrada,
    validarRegistroSalida,
    validarCrearUsuario,
    validarActualizarUsuario,
    validarCrearPlaza,
};
