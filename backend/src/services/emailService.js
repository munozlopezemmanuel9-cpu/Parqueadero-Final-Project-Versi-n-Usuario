const nodemailer = require('nodemailer');
const qrcode = require('qrcode');

// Configuración SMTP para Nodemailer
// Para pruebas, se puede usar Ethereal Email (https://ethereal.email/)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    auth: {
        user: process.env.SMTP_USER || 'ethereal.user@ethereal.email',
        pass: process.env.SMTP_PASS || 'password'
    }
});

/**
 * Enviar correo de confirmación de reserva con QR
 */
async function sendReservationEmail(email, reservaInfo) {
    try {
        // Generar QR code en base64
        const qrDataUrl = await qrcode.toDataURL(reservaInfo.codigo_reserva);
        
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #00ADB5;">¡Reserva Confirmada!</h2>
                <p>Hola, tu reserva en <strong>${reservaInfo.parqueadero_nombre}</strong> ha sido confirmada.</p>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>Código de Reserva:</strong> ${reservaInfo.codigo_reserva}</p>
                    <p><strong>Placa:</strong> ${reservaInfo.vehiculo_placa}</p>
                    <p><strong>Entrada:</strong> ${new Date(reservaInfo.fecha_inicio).toLocaleString()}</p>
                </div>
                <div style="text-align: center; margin: 20px 0;">
                    <p>Muestra este código QR al ingresar:</p>
                    <img src="${qrDataUrl}" alt="Código QR de Reserva" style="width: 200px; height: 200px;" />
                </div>
                <p style="color: #666; font-size: 12px; text-align: center;">Gracias por usar GPA Parqueadero.</p>
            </div>
        `;

        const info = await transporter.sendMail({
            from: '"GPA Parqueadero" <no-reply@gpa-parqueadero.com>',
            to: email,
            subject: 'Confirmación de Reserva - GPA',
            html: htmlContent
        });

        console.log('Correo enviado: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error enviando correo:', error);
        return false;
    }
}

module.exports = {
    sendReservationEmail
};
