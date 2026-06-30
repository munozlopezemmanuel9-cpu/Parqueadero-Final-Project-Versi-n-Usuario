-- =====================================================
-- GPA PARQUEADERO — INSERTAR MOVIMIENTOS DE PRUEBA
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- PROPÓSITO: Crear movimientos de prueba para simular ocupación
-- =====================================================

-- Primero, insertar vehículos de prueba si no existen
INSERT INTO public.vehiculos (placa, tipo, marca, modelo, color, propietario_id, creado_en, actualizado_en) VALUES
('ABC-123', 'carro', 'Toyota', 'Corolla', 'Rojo', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('DEF-456', 'carro', 'Honda', 'Civic', 'Azul', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('GHI-789', 'carro', 'Mazda', '3', 'Negro', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('JKL-012', 'carro', 'Chevrolet', 'Spark', 'Blanco', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('MNO-345', 'carro', 'Nissan', 'Versa', 'Gris', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('PQR-678', 'moto', 'Yamaha', 'R3', 'Azul', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('STU-901', 'moto', 'Honda', 'CBR', 'Rojo', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('VWX-234', 'moto', 'Kawasaki', 'Ninja', 'Verde', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (placa) DO NOTHING;

-- Obtener IDs de vehículos y plazas para crear movimientos
-- Nota: Este script asume que las plazas ya existen (M-01 a M-10, C-01 a C-15)

-- Insertar 5 movimientos de carros ocupados
INSERT INTO public.movimientos (
    vehiculo_id, 
    plaza_id, 
    usuario_registro_id, 
    tipo_movimiento, 
    fecha_entrada, 
    fecha_salida, 
    estado, 
    metodo_pago, 
    notas,
    creado_en, 
    actualizado_en
)
SELECT 
    v.id as vehiculo_id,
    p.id as plaza_id,
    1 as usuario_registro_id,
    'entrada' as tipo_movimiento,
    CURRENT_TIMESTAMP - INTERVAL '1 hour' as fecha_entrada, -- Entraron hace 1 hora
    NULL as fecha_salida,
    'en_parqueadero' as estado,
    NULL as metodo_pago,
    'Movimiento de prueba' as notas,
    CURRENT_TIMESTAMP as creado_en,
    CURRENT_TIMESTAMP as actualizado_en
FROM public.vehiculos v
CROSS JOIN public.plazas p
WHERE v.placa IN ('ABC-123', 'DEF-456', 'GHI-789', 'JKL-012', 'MNO-345')
AND v.tipo = 'carro'
AND p.tipo = 'carro'
AND p.estado = 'libre'
AND p.nombre IN ('C-01', 'C-02', 'C-03', 'C-04', 'C-05')
ON CONFLICT DO NOTHING;

-- Actualizar estado de las plazas de carros a ocupadas
UPDATE public.plazas
SET estado = 'ocupada'
WHERE nombre IN ('C-01', 'C-02', 'C-03', 'C-04', 'C-05');

-- Insertar 3 movimientos de motos ocupadas
INSERT INTO public.movimientos (
    vehiculo_id, 
    plaza_id, 
    usuario_registro_id, 
    tipo_movimiento, 
    fecha_entrada, 
    fecha_salida, 
    estado, 
    metodo_pago, 
    notas,
    creado_en, 
    actualizado_en
)
SELECT 
    v.id as vehiculo_id,
    p.id as plaza_id,
    1 as usuario_registro_id,
    'entrada' as tipo_movimiento,
    CURRENT_TIMESTAMP - INTERVAL '30 minutes' as fecha_entrada, -- Entraron hace 30 min
    NULL as fecha_salida,
    'en_parqueadero' as estado,
    NULL as metodo_pago,
    'Movimiento de prueba' as notas,
    CURRENT_TIMESTAMP as creado_en,
    CURRENT_TIMESTAMP as actualizado_en
FROM public.vehiculos v
CROSS JOIN public.plazas p
WHERE v.placa IN ('PQR-678', 'STU-901', 'VWX-234')
AND v.tipo = 'moto'
AND p.tipo = 'moto'
AND p.estado = 'libre'
AND p.nombre IN ('M-01', 'M-02', 'M-03')
ON CONFLICT DO NOTHING;

-- Actualizar estado de las plazas de motos a ocupadas
UPDATE public.plazas
SET estado = 'ocupada'
WHERE nombre IN ('M-01', 'M-02', 'M-03');

-- Verificación
SELECT 
    'Vehículos' as tabla, 
    COUNT(*) as total 
FROM public.vehiculos
UNION ALL
SELECT 
    'Movimientos activos' as tabla, 
    COUNT(*) as total 
FROM public.movimientos 
WHERE estado = 'en_parqueadero'
UNION ALL
SELECT 
    'Plazas ocupadas' as tabla, 
    COUNT(*) as total 
FROM public.plazas 
WHERE estado = 'ocupada';
