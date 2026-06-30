-- ============================================
-- SCRIPT POSTGRESQL PARA SUPABASE - GPA PARQUEADERO
-- ============================================

-- Habilitar extensiones si es necesario
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CONFIGURACIÓN DE RLS - DESHABILITADO
-- ============================================
-- Row Level Security está deshabilitado en todas las tablas
-- Ejecutar disable_rls_complete.sql para configurar permisos completos

-- ============================================
-- TABLA DE USUARIOS (Pública - Perfiles)
-- ============================================
-- Esta tabla se sincroniza o complementa auth.users de Supabase
CREATE TABLE IF NOT EXISTS public.usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255), -- Para compatibilidad, aunque Supabase Auth maneja contraseñas
    rol TEXT NOT NULL CHECK (rol IN ('admin', 'empleado')) DEFAULT 'empleado',
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Deshabilitar RLS en usuarios
ALTER TABLE IF EXISTS public.usuarios DISABLE ROW LEVEL SECURITY;

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON public.usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_activo ON public.usuarios(activo);

-- ============================================
-- TABLA DE PLAZAS DE PARQUEADERO
-- ============================================
CREATE TABLE IF NOT EXISTS public.plazas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('moto', 'carro', 'camioneta', 'discapacitado')) DEFAULT 'carro',
    estado TEXT NOT NULL CHECK (estado IN ('libre', 'ocupada', 'mantenimiento')) DEFAULT 'libre',
    tarifa_por_hora DECIMAL(10, 2) NOT NULL DEFAULT 5000,
    activa BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_plazas_estado ON public.plazas(estado);
CREATE INDEX IF NOT EXISTS idx_plazas_tipo ON public.plazas(tipo);

-- Deshabilitar RLS en plazas
ALTER TABLE IF EXISTS public.plazas DISABLE ROW LEVEL SECURITY;

-- ============================================
-- TABLA DE VEHICULOS
-- ============================================
CREATE TABLE IF NOT EXISTS public.vehiculos (
    id SERIAL PRIMARY KEY,
    placa VARCHAR(20) NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('moto', 'carro', 'camioneta', 'otro')) DEFAULT 'carro',
    marca VARCHAR(50),
    modelo VARCHAR(50),
    color VARCHAR(30),
    propietario_id INT REFERENCES public.usuarios(id) ON DELETE SET NULL,
    creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vehiculos_placa ON public.vehiculos(placa);
CREATE INDEX IF NOT EXISTS idx_vehiculos_propietario ON public.vehiculos(propietario_id);

-- Deshabilitar RLS en vehiculos
ALTER TABLE IF EXISTS public.vehiculos DISABLE ROW LEVEL SECURITY;

-- ============================================
-- TABLA DE MOVIMIENTOS (INGRESOS/SALIDAS)
-- ============================================
CREATE TABLE IF NOT EXISTS public.movimientos (
    id SERIAL PRIMARY KEY,
    vehiculo_id INT NOT NULL REFERENCES public.vehiculos(id) ON DELETE RESTRICT,
    plaza_id INT NOT NULL REFERENCES public.plazas(id) ON DELETE RESTRICT,
    usuario_registro_id INT REFERENCES public.usuarios(id) ON DELETE RESTRICT,
    tipo_movimiento TEXT NOT NULL CHECK (tipo_movimiento IN ('entrada', 'salida')),
    fecha_entrada TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_salida TIMESTAMPTZ,
    tarifa_aplicada DECIMAL(10, 2) DEFAULT 0,
    total_pagar DECIMAL(10, 2) DEFAULT 0,
    estado TEXT NOT NULL CHECK (estado IN ('en_parqueadero', 'finalizado', 'pendiente_pago')) DEFAULT 'en_parqueadero',
    metodo_pago TEXT CHECK (metodo_pago IN ('efectivo', 'tarjeta', 'transferencia', 'gratuito')),
    notas TEXT,
    creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_movimientos_estado ON public.movimientos(estado);
CREATE INDEX IF NOT EXISTS idx_movimientos_fecha_entrada ON public.movimientos(fecha_entrada);
CREATE INDEX IF NOT EXISTS idx_movimientos_fecha_salida ON public.movimientos(fecha_salida);

-- Deshabilitar RLS en movimientos
ALTER TABLE IF EXISTS public.movimientos DISABLE ROW LEVEL SECURITY;


-- ============================================
-- FUNCIONES Y TRIGGERS PARA ACTUALIZADO_EN
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON public.usuarios FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_vehiculos_updated_at BEFORE UPDATE ON public.vehiculos FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_movimientos_updated_at BEFORE UPDATE ON public.movimientos FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ============================================
-- VISTAS (EQUIVALENTES A LAS DE MYSQL)
-- ============================================

CREATE OR REPLACE VIEW public.v_estadisticas_diarias AS
SELECT
    DATE(fecha_entrada) as fecha,
    COUNT(*) as total_vehiculos,
    SUM(total_pagar) as total_recaudado,
    COUNT(*) FILTER (WHERE tipo_movimiento = 'entrada') as entradas,
    COUNT(*) FILTER (WHERE tipo_movimiento = 'salida') as salidas
FROM public.movimientos
GROUP BY DATE(fecha_entrada);

CREATE OR REPLACE VIEW public.v_plazas_disponibles AS
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
FROM public.plazas p
WHERE p.activa = TRUE;

-- ============================================
-- DATOS INICIALES (SEED)
-- ============================================

INSERT INTO public.plazas (nombre, tipo, tarifa_por_hora) VALUES
('A-01', 'carro', 5000), ('A-02', 'carro', 5000), ('A-03', 'carro', 5000), ('A-04', 'carro', 5000),
('M-01', 'moto', 2000), ('M-02', 'moto', 2000), ('M-03', 'moto', 2000), ('M-04', 'moto', 2000),
('C-01', 'camioneta', 7000), ('C-02', 'camioneta', 7000),
('D-01', 'discapacitado', 4000)
ON CONFLICT DO NOTHING;

