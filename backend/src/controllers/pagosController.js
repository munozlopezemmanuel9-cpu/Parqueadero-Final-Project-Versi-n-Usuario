const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../config/database');

/**
 * Crear un PaymentIntent para una reserva
 */
async function crearPaymentIntent(req, res) {
    try {
        const { monto, moneda = 'cop', descripcion } = req.body;
        const usuarioId = req.usuario.id;

        // Validar monto mínimo (Stripe requiere al menos algo equivalente a 0.50 USD)
        if (monto < 2000) {
            return res.status(400).json({ success: false, message: 'Monto mínimo no alcanzado' });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: monto,
            currency: moneda,
            description: descripcion || 'Reserva de parqueadero GPA',
            metadata: {
                usuarioId: usuarioId.toString()
            }
        });

        res.json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        console.error('Error al crear PaymentIntent:', error);
        res.status(500).json({
            success: false,
            message: 'Error al procesar el pago',
            error: error.message
        });
    }
}

module.exports = {
    crearPaymentIntent
};
