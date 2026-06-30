-- =====================================================
-- GPA PARQUEADERO — SCRIPT SIMPLIFICADO PARA ELIMINAR RLS
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- PROPÓSITO: Deshabilitar RLS y otorgar permisos completos
-- =====================================================

-- 1. DESHABILITAR RLS EN TABLAS PRINCIPALES
-- =====================================================
ALTER TABLE IF EXISTS public.reservas DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.parqueaderos DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.calificaciones DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.vehiculos DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.plazas DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.movimientos DISABLE ROW LEVEL SECURITY;

-- 2. ELIMINAR POLÍTICAS RLS (si existen)
-- =====================================================
DROP POLICY IF EXISTS "usuarios_ven_sus_reservas" ON public.reservas;
DROP POLICY IF EXISTS "usuarios_insertan_sus_reservas" ON public.reservas;
DROP POLICY IF EXISTS "usuarios_actualizan_sus_reservas" ON public.reservas;
DROP POLICY IF EXISTS "admins_acceso_total_reservas" ON public.reservas;

-- 3. OTORGAR PERMISOS COMPLETOS
-- =====================================================
-- Tablas principales
GRANT ALL ON public.reservas TO anon;
GRANT ALL ON public.reservas TO authenticated;
GRANT ALL ON SEQUENCE public.reservas_id_seq TO anon;
GRANT ALL ON SEQUENCE public.reservas_id_seq TO authenticated;

GRANT ALL ON public.usuarios TO anon;
GRANT ALL ON public.usuarios TO authenticated;
GRANT ALL ON SEQUENCE public.usuarios_id_seq TO anon;
GRANT ALL ON SEQUENCE public.usuarios_id_seq TO authenticated;

GRANT ALL ON public.parqueaderos TO anon;
GRANT ALL ON public.parqueaderos TO authenticated;
GRANT ALL ON SEQUENCE public.parqueaderos_id_seq TO anon;
GRANT ALL ON SEQUENCE public.parqueaderos_id_seq TO authenticated;

GRANT ALL ON public.calificaciones TO anon;
GRANT ALL ON public.calificaciones TO authenticated;

GRANT ALL ON public.vehiculos TO anon;
GRANT ALL ON public.vehiculos TO authenticated;
GRANT ALL ON SEQUENCE public.vehiculos_id_seq TO anon;
GRANT ALL ON SEQUENCE public.vehiculos_id_seq TO authenticated;

GRANT ALL ON public.plazas TO anon;
GRANT ALL ON public.plazas TO authenticated;
GRANT ALL ON SEQUENCE public.plazas_id_seq TO anon;
GRANT ALL ON SEQUENCE public.plazas_id_seq TO authenticated;

GRANT ALL ON public.movimientos TO anon;
GRANT ALL ON public.movimientos TO authenticated;
GRANT ALL ON SEQUENCE public.movimientos_id_seq TO anon;
GRANT ALL ON SEQUENCE public.movimientos_id_seq TO authenticated;

-- 4. VERIFICACIÓN
-- =====================================================
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
