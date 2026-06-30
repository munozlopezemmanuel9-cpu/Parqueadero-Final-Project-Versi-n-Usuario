-- =====================================================
-- GPA Parqueadero — Script SQL para Supabase
-- Tabla: reservas + función RPC + índices
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- =====================================================

-- 1. Tabla RESERVAS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.reservas (
    id              BIGSERIAL PRIMARY KEY,
    usuario_id      BIGINT REFERENCES public.usuarios(id) ON DELETE SET NULL,
    parqueadero_id  BIGINT REFERENCES public.parqueaderos(id) ON DELETE RESTRICT,
    vehiculo_placa  VARCHAR(10)   NOT NULL,
    vehiculo_tipo   VARCHAR(20)   NOT NULL DEFAULT 'carro',
    fecha_inicio    TIMESTAMPTZ   NOT NULL,
    fecha_fin       TIMESTAMPTZ   NOT NULL,
    horas_estimadas NUMERIC(4,1)  NOT NULL DEFAULT 1,
    total           NUMERIC(12,2) NOT NULL DEFAULT 0,
    metodo_pago     VARCHAR(30)   NOT NULL DEFAULT 'simulado',
    stripe_payment_intent_id VARCHAR(100) DEFAULT NULL,
    pago_confirmado BOOLEAN       NOT NULL DEFAULT FALSE,
    estado          VARCHAR(20)   NOT NULL DEFAULT 'confirmada'
                    CHECK (estado IN ('confirmada', 'activa', 'completada', 'cancelada')),
    codigo_reserva  VARCHAR(10)   NOT NULL UNIQUE,
    notas           TEXT          DEFAULT NULL,
    creado_en       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    actualizado_en  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- 2. Índices para mejorar el rendimiento
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_reservas_usuario     ON public.reservas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_reservas_parqueadero ON public.reservas(parqueadero_id);
CREATE INDEX IF NOT EXISTS idx_reservas_estado      ON public.reservas(estado);
CREATE INDEX IF NOT EXISTS idx_reservas_codigo      ON public.reservas(codigo_reserva);

-- 3. Trigger para actualizar la columna actualizado_en automáticamente
-- =====================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.actualizado_en = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_reservas_updated ON public.reservas;
CREATE TRIGGER trg_reservas_updated
    BEFORE UPDATE ON public.reservas
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4. Función RPC: decrementar_espacio (llamada al crear una reserva)
-- =====================================================
CREATE OR REPLACE FUNCTION public.decrementar_espacio(p_id BIGINT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.parqueaderos
  SET espacios_disponibles = GREATEST(espacios_disponibles - 1, 0)
  WHERE id = p_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Row Level Security (RLS) - DESHABILITADO
-- =====================================================
-- RLS ha sido deshabilitado completamente para permitir acceso
-- sin restricciones de seguridad a nivel de fila.
-- Ejecutar disable_rls_complete.sql para configurar permisos.

ALTER TABLE public.reservas DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
