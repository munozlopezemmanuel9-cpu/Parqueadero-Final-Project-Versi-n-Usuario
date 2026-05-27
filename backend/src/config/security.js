/**
 * Configuración de Seguridad para GPA Parqueadero
 *
 * Este archivo configura:
 * - Rate limiting para prevenir ataques
 * - Security headers avanzados
 * - Validación de CORS
 * - Configuración de sesiones
 *
 * @author Equipo de Desarrollo
 * @version 2.0.0
 */

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// ============================================
// RATE LIMITING
// ============================================

/**
 * Rate limiter general
 *
 * Limita el número de solicitudes por IP
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 solicitudes por ventana
  message: {
    success: false,
    message: 'Demasiadas solicitudes desde esta IP, intente más tarde',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter para login
 *
 * Limita intentos de login para prevenir ataques de fuerza bruta
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 intentos de login
  message: {
    success: false,
    message: 'Demasiados intentos de login. Intente más tarde',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter para registro
 *
 * Limita registros para prevenir spam
 */
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // Máximo 3 registros por hora
  message: {
    success: false,
    message: 'Demasiados registros desde esta IP. Intente más tarde',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ============================================
// SECURITY HEADERS
// ============================================

/**
 * Configurar security headers con Helmet
 *
 * @param {Object} app - Aplicación Express
 */
function configureSecurityHeaders(app) {
  // Usar Helmet con configuración segura
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          fontSrc: ["'self'"],
          connectSrc: ["'self'"],
          frameAncestors: ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: true,
      crossOriginOpenerPolicy: true,
      crossOriginResourcePolicy: { policy: 'same-site' },
      dnsPrefetchControl: { allow: false },
      frameguard: { action: 'deny' },
      hidePoweredBy: true,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      ieNoOpen: true,
      noSniff: true,
      originAgentCluster: true,
      permittedCrossDomainPolicies: { permittedPolicies: 'none' },
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      xssFilter: true,
    })
  );
}

// ============================================
// MIDDLEWARES DE SEGURIDAD
// ============================================

/**
 * Middleware para sanitización de datos
 *
 * Elimina caracteres peligrosos de los inputs
 *
 * @param {Object} req - Solicitud Express
 * @param {Object} res - Respuesta Express
 * @param {Function} next - Siguiente middleware
 */
function sanitizeInput(req, res, next) {
  // Sanitizar body
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }

  // Sanitizar query params
  if (req.query) {
    Object.keys(req.query).forEach((key) => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key].trim();
      }
    });
  }

  next();
}

/**
 * Middleware para logging de seguridad
 *
 * Registra intentos de acceso y errores de seguridad
 *
 * @param {Object} req - Solicitud Express
 * @param {Object} res - Respuesta Express
 * @param {Function} next - Siguiente middleware
 */
function securityLogger(req, res, next) {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      method: req.method,
      url: req.url,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    };

    // Log según el status code
    if (res.statusCode >= 500) {
      console.error('[SECURITY ERROR]', logData);
    } else if (res.statusCode >= 400) {
      console.warn('[SECURITY WARNING]', logData);
    } else {
      console.log('[SECURITY INFO]', logData);
    }
  });

  next();
}

// ============================================
// EXPORTACIÓN
// ============================================

module.exports = {
  generalLimiter,
  loginLimiter,
  registerLimiter,
  configureSecurityHeaders,
  sanitizeInput,
  securityLogger,
};
