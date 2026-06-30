-- ============================================
-- SCRIPT SQL GPA PARQUEADERO — v3.0 ECOSISTEMA
-- ============================================
-- Medellín, Colombia
-- ============================================

DROP DATABASE IF EXISTS gpa_parqueadero;
CREATE DATABASE IF NOT EXISTS gpa_parqueadero
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
USE gpa_parqueadero;

-- ============================================
-- TABLA DE USUARIOS (actualizada con rol cliente)
-- ============================================
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(20) NULL,
    avatar_url TEXT NULL,
    rol ENUM('admin', 'empleado', 'cliente') NOT NULL DEFAULT 'cliente',
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_activo (activo),
    INDEX idx_rol (rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA DE PARQUEADEROS (NUEVA)
-- ============================================
CREATE TABLE parqueaderos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    barrio VARCHAR(100) NOT NULL,
    ciudad VARCHAR(50) NOT NULL DEFAULT 'Medellín',
    lat DECIMAL(10,8) NOT NULL,
    lng DECIMAL(11,8) NOT NULL,
    capacidad_total INT NOT NULL DEFAULT 50,
    espacios_disponibles INT NOT NULL DEFAULT 50,
    tarifa_hora DECIMAL(10,2) NOT NULL DEFAULT 5000,
    tarifa_dia DECIMAL(10,2) NULL,
    horario_apertura TIME DEFAULT '06:00:00',
    horario_cierre TIME DEFAULT '22:00:00',
    abierto_24h BOOLEAN DEFAULT FALSE,
    imagen_url TEXT NULL,
    rating_promedio DECIMAL(3,2) DEFAULT 0.00,
    total_calificaciones INT DEFAULT 0,
    acepta_reservas BOOLEAN DEFAULT TRUE,
    tiene_camaras BOOLEAN DEFAULT TRUE,
    tiene_techado BOOLEAN DEFAULT TRUE,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ciudad (ciudad),
    INDEX idx_activo (activo),
    INDEX idx_lat_lng (lat, lng)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA DE PLAZAS
-- ============================================
CREATE TABLE plazas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parqueadero_id INT NULL,
    nombre VARCHAR(20) NOT NULL,
    tipo ENUM('moto', 'carro', 'camioneta', 'discapacitado') NOT NULL DEFAULT 'carro',
    estado ENUM('libre', 'ocupada', 'mantenimiento') NOT NULL DEFAULT 'libre',
    tarifa_por_hora DECIMAL(10, 2) NOT NULL DEFAULT 5000,
    activa BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parqueadero_id) REFERENCES parqueaderos(id) ON DELETE SET NULL,
    INDEX idx_estado (estado),
    INDEX idx_tipo (tipo),
    INDEX idx_parqueadero (parqueadero_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA DE VEHICULOS
-- ============================================
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
    FOREIGN KEY (propietario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_placa (placa),
    INDEX idx_propietario (propietario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA DE RESERVAS (NUEVA)
-- ============================================
CREATE TABLE reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    parqueadero_id INT NOT NULL,
    vehiculo_placa VARCHAR(20) NOT NULL,
    vehiculo_tipo ENUM('moto', 'carro', 'camioneta', 'otro') DEFAULT 'carro',
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    horas_estimadas INT NOT NULL DEFAULT 1,
    estado ENUM('pendiente', 'confirmada', 'activa', 'completada', 'cancelada') NOT NULL DEFAULT 'pendiente',
    total DECIMAL(10,2) NOT NULL DEFAULT 0,
    codigo_reserva VARCHAR(12) NOT NULL UNIQUE,
    stripe_payment_intent_id VARCHAR(255) NULL,
    metodo_pago ENUM('simulado', 'efectivo', 'tarjeta') DEFAULT 'simulado',
    pago_confirmado BOOLEAN DEFAULT FALSE,
    notas TEXT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    FOREIGN KEY (parqueadero_id) REFERENCES parqueaderos(id) ON DELETE RESTRICT,
    INDEX idx_usuario (usuario_id),
    INDEX idx_parqueadero (parqueadero_id),
    INDEX idx_estado (estado),
    INDEX idx_codigo (codigo_reserva),
    INDEX idx_fecha (fecha_inicio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA DE MOVIMIENTOS (INGRESOS/SALIDAS)
-- ============================================
CREATE TABLE movimientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehiculo_id INT NOT NULL,
    plaza_id INT NOT NULL,
    usuario_registro_id INT NOT NULL,
    reserva_id INT NULL,
    tipo_movimiento ENUM('entrada', 'salida') NOT NULL,
    fecha_entrada DATETIME NOT NULL,
    fecha_salida DATETIME NULL,
    tarifa_aplicada DECIMAL(10, 2) DEFAULT 0,
    total_pagar DECIMAL(10, 2) DEFAULT 0,
    estado ENUM('en_parqueadero', 'finalizado', 'pendiente_pago') NOT NULL DEFAULT 'en_parqueadero',
    metodo_pago ENUM('efectivo', 'tarjeta', 'transferencia', 'gratuito', 'reserva') DEFAULT NULL,
    notas TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id) ON DELETE RESTRICT,
    FOREIGN KEY (plaza_id) REFERENCES plazas(id) ON DELETE RESTRICT,
    FOREIGN KEY (usuario_registro_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE SET NULL,
    INDEX idx_estado (estado),
    INDEX idx_fecha_entrada (fecha_entrada),
    INDEX idx_usuario (usuario_registro_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA DE CALIFICACIONES (NUEVA)
-- ============================================
CREATE TABLE calificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    parqueadero_id INT NOT NULL,
    reserva_id INT NULL,
    puntuacion_general INT NOT NULL CHECK (puntuacion_general BETWEEN 1 AND 5),
    puntuacion_seguridad INT CHECK (puntuacion_seguridad BETWEEN 1 AND 5),
    puntuacion_atencion INT CHECK (puntuacion_atencion BETWEEN 1 AND 5),
    puntuacion_acceso INT CHECK (puntuacion_acceso BETWEEN 1 AND 5),
    comentario TEXT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (parqueadero_id) REFERENCES parqueaderos(id) ON DELETE CASCADE,
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE SET NULL,
    UNIQUE KEY unique_reserva_calificacion (reserva_id),
    INDEX idx_parqueadero (parqueadero_id),
    INDEX idx_usuario (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA DE SUSCRIPCIONES (NUEVA FASE 3)
-- ============================================
CREATE TABLE suscripciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    parqueadero_id INT NOT NULL,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    estado ENUM('activa', 'cancelada', 'vencida') NOT NULL DEFAULT 'activa',
    precio_mensual DECIMAL(10,2) NOT NULL,
    stripe_subscription_id VARCHAR(255) NULL,
    stripe_customer_id VARCHAR(255) NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (parqueadero_id) REFERENCES parqueaderos(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_parqueadero (parqueadero_id),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- DATOS DE PRUEBA
-- ============================================

-- Usuarios
INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES
('Administrador GPA', 'admin@gpa.com', '$2a$10$rQZ9vXJXL5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K', 'admin'),
('Empleado GPA', 'empleado@gpa.com', '$2a$10$rQZ9vXJXL5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K', 'empleado'),
('Cliente Demo', 'cliente@demo.com', '$2a$10$rQZ9vXJXL5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K', 'cliente');

-- Parqueaderos en Medellín
INSERT INTO parqueaderos (nombre, direccion, barrio, lat, lng, capacidad_total, espacios_disponibles, tarifa_hora, tarifa_dia, horario_apertura, horario_cierre, abierto_24h, rating_promedio, total_calificaciones, tiene_camaras, tiene_techado) VALUES
('Parqueadero El Poblado Centro', 'Cra. 43A #10-50, El Poblado', 'El Poblado', 6.20820, -75.57030, 120, 45, 4000, 35000, '06:00:00', '23:59:00', FALSE, 4.5, 128, TRUE, TRUE),
('Parqueadero Laureles Express', 'Cll. 33 #76-20, Laureles', 'Laureles', 6.24800, -75.59200, 80, 12, 3500, 28000, '05:00:00', '23:00:00', FALSE, 4.2, 89, TRUE, FALSE),
('Parqueadero 24/7 Estadio', 'Cra. 74 #44-50, Estadio', 'Estadio', 6.25600, -75.59800, 200, 87, 3000, 25000, '00:00:00', '23:59:00', TRUE, 3.9, 214, TRUE, TRUE),
('Parqueadero Premium Patio Bonito', 'Cll. 18 #43-20, Patio Bonito', 'Patio Bonito', 6.23100, -75.57800, 60, 3, 5000, 45000, '07:00:00', '21:00:00', FALSE, 4.8, 56, TRUE, TRUE),
('Parqueadero Envigado Sur', 'Cra. 48 #37 Sur-50, Envigado', 'Envigado', 6.17400, -75.59100, 150, 92, 3500, 30000, '05:30:00', '22:30:00', FALSE, 4.1, 103, TRUE, FALSE),
('Parqueadero Centro Histórico', 'Cll. 44 #52-30, Centro', 'La Candelaria', 6.25150, -75.56900, 90, 0, 2500, 20000, '06:00:00', '20:00:00', FALSE, 3.7, 77, FALSE, FALSE);

-- Plazas del parqueadero principal
INSERT INTO plazas (parqueadero_id, nombre, tipo, tarifa_por_hora) VALUES
(1, 'A-01', 'carro', 4000),(1, 'A-02', 'carro', 4000),(1, 'A-03', 'carro', 4000),(1, 'A-04', 'carro', 4000),
(1, 'A-05', 'carro', 4000),(1, 'A-06', 'carro', 4000),(1, 'A-07', 'carro', 4000),(1, 'A-08', 'carro', 4000),
(1, 'M-01', 'moto', 2000),(1, 'M-02', 'moto', 2000),(1, 'M-03', 'moto', 2000),(1, 'M-04', 'moto', 2000),
(1, 'C-01', 'camioneta', 6000),(1, 'C-02', 'camioneta', 6000),
(1, 'D-01', 'discapacitado', 3000),(1, 'D-02', 'discapacitado', 3000);

-- Calificaciones de demo
INSERT INTO calificaciones (usuario_id, parqueadero_id, puntuacion_general, puntuacion_seguridad, puntuacion_atencion, puntuacion_acceso, comentario) VALUES
(3, 1, 5, 5, 4, 5, '¡Excelente parqueadero! Muy seguro y bien ubicado en El Poblado.'),
(3, 2, 4, 4, 5, 3, 'Buen servicio, aunque el acceso es un poco complicado.'),
(3, 3, 4, 3, 4, 5, 'Muy conveniente por ser 24/7, ideal para conciertos en el Estadio.');

-- ============================================
-- VISTAS ESTADÍSTICAS
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

CREATE OR REPLACE VIEW v_plazas_disponibles AS
SELECT p.id, p.nombre, p.tipo, p.estado, p.tarifa_por_hora,
    CASE
        WHEN p.estado = 'libre' THEN 'Disponible'
        WHEN p.estado = 'ocupada' THEN 'Ocupada'
        WHEN p.estado = 'mantenimiento' THEN 'Mantenimiento'
    END as estado_descripcion
FROM plazas p WHERE p.activa = TRUE;

CREATE OR REPLACE VIEW v_parqueaderos_disponibles AS
SELECT p.*, 
    ROUND((p.espacios_disponibles / p.capacidad_total) * 100, 1) as porcentaje_disponible,
    CASE
        WHEN p.espacios_disponibles = 0 THEN 'completo'
        WHEN (p.espacios_disponibles / p.capacidad_total) < 0.2 THEN 'pocos'
        ELSE 'disponible'
    END as estado_disponibilidad
FROM parqueaderos p WHERE p.activo = TRUE;

-- ============================================
-- FIN DEL SCRIPT v3.0
-- ============================================
