-- ============================================
-- SCRIPT SQL PARA SISTEMA DE PARQUEADERO GPA
-- ============================================
-- Este script crea la base de datos y todas las
-- tablas necesarias para el funcionamiento del
-- sistema de gestión de parqueadero
-- ============================================

-- Eliminar base de datos si existe (para reinicio limpio)
DROP DATABASE IF EXISTS gpa_parqueadero;

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS gpa_parqueadero
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE gpa_parqueadero;

-- ============================================
-- TABLA DE USUARIOS
-- ============================================
-- Almacena la información de los usuarios del sistema
-- con sus credenciales y roles
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'empleado') NOT NULL DEFAULT 'empleado',
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Índice para búsquedas rápidas por email
    INDEX idx_email (email),
    -- Índice para filtrar por estado activo
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA DE PLAZAS DE PARQUEADERO
-- ============================================
-- Define las plazas/disponibles del parqueadero
CREATE TABLE plazas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL,
    tipo ENUM('moto', 'carro', 'camioneta', 'discapacitado') NOT NULL DEFAULT 'carro',
    estado ENUM('libre', 'ocupada', 'mantenimiento') NOT NULL DEFAULT 'libre',
    tarifa_por_hora DECIMAL(10, 2) NOT NULL DEFAULT 5000,
    activa BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Índice para filtrar por estado
    INDEX idx_estado (estado),
    -- Índice para filtrar por tipo
    INDEX idx_tipo (tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA DE VEHICULOS
-- ============================================
-- Registro de vehículos que ingresan al parqueadero
CREATE TABLE vehiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    placa VARCHAR(20) NOT NULL,
    tipo ENUM('moto', 'carro', 'camioneta', 'otro') NOT NULL DEFAULT 'carro',
    marca VARCHAR(50),
    modelo VARCHAR(50),
    color VARCHAR(30),
    propietario_id INT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Relación con usuarios (propietarios frecuentes)
    FOREIGN KEY (propietario_id) REFERENCES usuarios(id) ON DELETE SET NULL,

    -- Índice para búsquedas por placa
    INDEX idx_placa (placa),
    -- Índice para búsquedas por propietario
    INDEX idx_propietario (propietario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA DE MOVIMIENTOS (INGRESOS/SALIDAS)
-- ============================================
-- Registro histórico de todos los movimientos
-- de vehículos en el parqueadero
CREATE TABLE movimientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehiculo_id INT NOT NULL,
    plaza_id INT NOT NULL,
    usuario_registro_id INT NOT NULL,
    tipo_movimiento ENUM('entrada', 'salida') NOT NULL,
    fecha_entrada DATETIME NOT NULL,
    fecha_salida DATETIME NULL,
    tarifa_aplicada DECIMAL(10, 2) DEFAULT 0,
    total_pagar DECIMAL(10, 2) DEFAULT 0,
    estado ENUM('en_parqueadero', 'finalizado', 'pendiente_pago') NOT NULL DEFAULT 'en_parqueadero',
    metodo_pago ENUM('efectivo', 'tarjeta', 'transferencia', 'gratuito') DEFAULT NULL,
    notas TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Relaciones con otras tablas
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id) ON DELETE RESTRICT,
    FOREIGN KEY (plaza_id) REFERENCES plazas(id) ON DELETE RESTRICT,
    FOREIGN KEY (usuario_registro_id) REFERENCES usuarios(id) ON DELETE RESTRICT,

    -- Índices para consultas frecuentes
    INDEX idx_estado (estado),
    INDEX idx_fecha_entrada (fecha_entrada),
    INDEX idx_fecha_salida (fecha_salida),
    INDEX idx_usuario (usuario_registro_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================
-- DATOS DE PRUEBA (SEEDERS)
-- ============================================

-- Usuario administrador por defecto
-- Contraseña: admin123 (hash generado con bcrypt)
INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES
('Administrador Principal', 'admin@gpa.com', '$2a$10$rQZ9vXJXL5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K', 'admin'),
('Empleado Ejemplo', 'empleado@gpa.com', '$2a$10$rQZ9vXJXL5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K', 'empleado');

-- NOTA: Los hashes anteriores son placeholder.
-- Debes generarlos correctamente con bcryptjs
-- Password 'admin123' hash real: $2a$10$... (se genera en el código)

-- Plazas de parqueadero de ejemplo
INSERT INTO plazas (nombre, tipo, tarifa_por_hora) VALUES
-- Plazas para carros
('A-01', 'carro', 5000),
('A-02', 'carro', 5000),
('A-03', 'carro', 5000),
('A-04', 'carro', 5000),
('A-05', 'carro', 5000),
('A-06', 'carro', 5000),
('A-07', 'carro', 5000),
('A-08', 'carro', 5000),
-- Plazas para motos
('M-01', 'moto', 2000),
('M-02', 'moto', 2000),
('M-03', 'moto', 2000),
('M-04', 'moto', 2000),
-- Plazas para camionetas
('C-01', 'camioneta', 7000),
('C-02', 'camioneta', 7000),
-- Plazas para discapacitados
('D-01', 'discapacitado', 4000),
('D-02', 'discapacitado', 4000);


-- ============================================
-- VISTA PARA ESTADISTICAS
-- ============================================
CREATE OR REPLACE VIEW v_estadisticas_diarias AS
SELECT
    DATE(fecha_entrada) as fecha,
    COUNT(*) as total_vehiculos,
    SUM(total_pagar) as total_recaudado,
    COUNT(CASE WHEN tipo_movimiento = 'entrada' THEN 1 END) as entradas,
    COUNT(CASE WHEN tipo_movimiento = 'salida' THEN 1 END) as salidas
FROM movimientos
GROUP BY DATE(fecha_entrada);

-- ============================================
-- VISTA PARA PLAZAS DISPONIBLES
-- ============================================
CREATE OR REPLACE VIEW v_plazas_disponibles AS
SELECT
    p.id,
    p.nombre,
    p.tipo,
    p.estado,
    p.tarifa_por_hora,
    CASE
        WHEN p.estado = 'libre' THEN 'Disponible'
        WHEN p.estado = 'ocupada' THEN 'Ocupada'
        WHEN p.estado = 'mantenimiento' THEN 'Mantenimiento'
    END as estado_descripcion
FROM plazas p
WHERE p.activa = TRUE;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
