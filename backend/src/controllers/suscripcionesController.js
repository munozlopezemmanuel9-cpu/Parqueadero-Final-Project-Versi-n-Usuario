const db = require('../config/database');

/**
 * Obtener suscripciones del usuario
 */
async function obtenerMisSuscripciones(req, res) {
    try {
        const usuarioId = req.usuario.id;
        const sql = `
            SELECT s.*, p.nombre as parqueadero_nombre 
            FROM suscripciones s
            JOIN parqueaderos p ON s.parqueadero_id = p.id
            WHERE s.usuario_id = ?
            ORDER BY s.creado_en DESC
        `;
        const suscripciones = await db.query(sql, [usuarioId]);
        
        res.json({ success: true, data: { suscripciones } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener suscripciones', error: error.message });
    }
}

/**
 * Adquirir nueva suscripción
 */
async function adquirirSuscripcion(req, res) {
    try {
        const { parqueadero_id, precio_mensual, stripe_payment_intent_id } = req.body;
        const usuarioId = req.usuario.id;

        // Validar que no tenga una suscripción activa para ese parqueadero
        const sqlCheck = `SELECT id FROM suscripciones WHERE usuario_id = ? AND parqueadero_id = ? AND estado = 'activa'`;
        const activas = await db.query(sqlCheck, [usuarioId, parqueadero_id]);
        if (activas.length > 0) {
            return res.status(400).json({ success: false, message: 'Ya tienes una suscripción activa para este parqueadero' });
        }

        const fechaInicio = new Date();
        const fechaFin = new Date();
        fechaFin.setMonth(fechaFin.getMonth() + 1);

        const sqlInsert = `
            INSERT INTO suscripciones (usuario_id, parqueadero_id, fecha_inicio, fecha_fin, estado, precio_mensual, stripe_subscription_id)
            VALUES (?, ?, ?, ?, 'activa', ?, ?)
        `;
        
        const resultado = await db.query(sqlInsert, [
            usuarioId, 
            parqueadero_id, 
            fechaInicio, 
            fechaFin, 
            precio_mensual, 
            stripe_payment_intent_id || null
        ]);

        res.json({ success: true, message: 'Suscripción adquirida exitosamente', data: { id: resultado.insertId } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al adquirir suscripción', error: error.message });
    }
}

module.exports = {
    obtenerMisSuscripciones,
    adquirirSuscripcion
};
