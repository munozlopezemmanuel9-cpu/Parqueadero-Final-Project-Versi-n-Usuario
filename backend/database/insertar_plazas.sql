-- =====================================================
-- GPA PARQUEADERO — INSERTAR 30 PLAZAS
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- PROPÓSITO: Crear 30 plazas iniciales para el sistema
-- =====================================================

-- Limpiar plazas existentes (opcional - comentar si quieres mantener datos)
-- TRUNCATE TABLE public.plazas RESTART IDENTITY;

-- Insertar 30 plazas: 10 motos, 15 carros, 5 camionetas
INSERT INTO public.plazas (nombre, tipo, estado, tarifa_por_hora, activa) VALUES
-- 10 plazas para motos
('M-01', 'moto', 'libre', 2000, true),
('M-02', 'moto', 'libre', 2000, true),
('M-03', 'moto', 'libre', 2000, true),
('M-04', 'moto', 'libre', 2000, true),
('M-05', 'moto', 'libre', 2000, true),
('M-06', 'moto', 'libre', 2000, true),
('M-07', 'moto', 'libre', 2000, true),
('M-08', 'moto', 'libre', 2000, true),
('M-09', 'moto', 'libre', 2000, true),
('M-10', 'moto', 'libre', 2000, true),

-- 15 plazas para carros
('C-01', 'carro', 'libre', 5000, true),
('C-02', 'carro', 'libre', 5000, true),
('C-03', 'carro', 'libre', 5000, true),
('C-04', 'carro', 'libre', 5000, true),
('C-05', 'carro', 'libre', 5000, true),
('C-06', 'carro', 'libre', 5000, true),
('C-07', 'carro', 'libre', 5000, true),
('C-08', 'carro', 'libre', 5000, true),
('C-09', 'carro', 'libre', 5000, true),
('C-10', 'carro', 'libre', 5000, true),
('C-11', 'carro', 'libre', 5000, true),
('C-12', 'carro', 'libre', 5000, true),
('C-13', 'carro', 'libre', 5000, true),
('C-14', 'carro', 'libre', 5000, true),
('C-15', 'carro', 'libre', 5000, true),

-- 5 plazas para camionetas
('T-01', 'camioneta', 'libre', 7000, true),
('T-02', 'camioneta', 'libre', 7000, true),
('T-03', 'camioneta', 'libre', 7000, true),
('T-04', 'camioneta', 'libre', 7000, true),
('T-05', 'camioneta', 'libre', 7000, true);

-- Verificación
SELECT COUNT(*) as total_plazas, tipo, estado 
FROM public.plazas 
GROUP BY tipo, estado 
ORDER BY tipo, estado;
