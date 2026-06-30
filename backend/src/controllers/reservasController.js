const db = require('../config/database');

const generarCodigo = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

/**
 * Crear Reserva
 */
async function crearReserva(req, res) {
    try {
        const usuarioId = req.usuario.id;
        const {
            parqueadero_id,
            vehiculo_placa,
            vehiculo_tipo,
            fecha_inicio,
            fecha_fin,
            horas_estimadas,
            total,
            metodo_pago,
            stripe_payment_intent_id,
            notas
        } = req.body;

        const codigo_reserva = generarCodigo();

        const sql = `
            INSERT INTO reservas (
                usuario_id, parqueadero_id, vehiculo_placa, vehiculo_tipo,
                fecha_inicio, fecha_fin, horas_estimadas, estado, total,
                codigo_reserva, metodo_pago, stripe_payment_intent_id, pago_confirmado, notas
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmada', ?, ?, ?, ?, ?, ?)
        `;

        const params = [
            usuarioId, parqueadero_id, vehiculo_placa, vehiculo_tipo,
            fecha_inicio, fecha_fin, horas_estimadas, total,
            codigo_reserva, metodo_pago || 'simulado', stripe_payment_intent_id || null, 
            stripe_payment_intent_id ? true : false, notas || null
        ];

        const result = await db.query(sql, params);
        
        // Disminuir espacios disponibles
        await db.query('UPDATE parqueaderos SET espacios_disponibles = espacios_disponibles - 1 WHERE id = ?', [parqueadero_id]);

        // Obtener la reserva recién creada
        const [reserva] = await db.query('SELECT * FROM reservas WHERE id = ?', [result.insertId]);

        res.json({
            success: true,
            data: { reserva }
        });
    } catch (error) {
        console.error('Error al crear reserva:', error);
        res.status(500).json({ success: false, message: 'Error al crear la reserva', error: error.message });
    }
}

/**
 * Obtener Mis Reservas
 */
async function obtenerMisReservas(req, res) {
    try {
        const usuarioId = req.usuario.id;

        const sql = `
            SELECT r.*, 
                   p.nombre as parqueadero_nombre, 
                   p.direccion as parqueadero_direccion, 
                   p.lat as parqueadero_lat, 
                   p.lng as parqueadero_lng
            FROM reservas r
            JOIN parqueaderos p ON r.parqueadero_id = p.id
            WHERE r.usuario_id = ?
            ORDER BY r.creado_en DESC
        `;

        const reservas = await db.query(sql, [usuarioId]);

        // Formatear para el frontend que espera un objeto 'parqueaderos' anidado
        const reservasFormateadas = reservas.map(r => ({
            ...r,
            parqueaderos: {
                nombre: r.parqueadero_nombre,
                direccion: r.parqueadero_direccion,
                lat: r.parqueadero_lat,
                lng: r.parqueadero_lng
            }
        }));

        res.json({
            success: true,
            data: { reservas: reservasFormateadas }
        });
    } catch (error) {
        console.error('Error al obtener mis reservas:', error);
        res.status(500).json({ success: false, message: 'Error al cargar reservas' });
    }
}

module.exports = {
    crearReserva,
    obtenerMisReservas
};
