const webpush = require('web-push');

// Las VAPID keys se generarían usando webpush.generateVAPIDKeys()
// Aquí en un entorno de producción deberían venir de variables de entorno.
const publicVapidKey = process.env.PUBLIC_VAPID_KEY || 'BEl62iN...';
const privateVapidKey = process.env.PRIVATE_VAPID_KEY || 'sqG0u...';

webpush.setVapidDetails(
    'mailto:test@gpa-parqueadero.com',
    publicVapidKey,
    privateVapidKey
);

/**
 * Enviar notificación push
 * @param {Object} subscription - Objeto de suscripción Web Push del cliente
 * @param {Object} payload - Datos de la notificación { title, body }
 */
async function sendPushNotification(subscription, payload) {
    try {
        await webpush.sendNotification(subscription, JSON.stringify(payload));
        return true;
    } catch (error) {
        console.error('Error enviando notificación push:', error);
        return false;
    }
}

module.exports = {
    sendPushNotification,
    publicVapidKey
};
