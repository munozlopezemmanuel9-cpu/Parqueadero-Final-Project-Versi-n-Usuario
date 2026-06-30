const db = require('./backend/src/config/database');

async function migrate() {
    try {
        console.log('Running migrations...');
        
        await db.query(`
            CREATE TABLE IF NOT EXISTS suscripciones (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario_id INT NOT NULL,
                parqueadero_id INT NOT NULL,
                fecha_inicio DATETIME NOT NULL,
                fecha_fin DATETIME NOT NULL,
                estado ENUM('activa', 'cancelada', 'vencida') NOT NULL DEFAULT 'activa',
                precio_mensual DECIMAL(10,2) NOT NULL,
                stripe_subscription_id VARCHAR(255) NULL,
                stripe_customer_id VARCHAR(255) NULL,
                creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                FOREIGN KEY (parqueadero_id) REFERENCES parqueaderos(id) ON DELETE CASCADE,
                INDEX idx_usuario (usuario_id),
                INDEX idx_parqueadero (parqueadero_id),
                INDEX idx_estado (estado)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log('Table suscripciones checked/created.');

        try {
            await db.query(`ALTER TABLE reservas ADD COLUMN stripe_payment_intent_id VARCHAR(255) NULL AFTER codigo_reserva;`);
            console.log('Column stripe_payment_intent_id added to reservas.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('Column stripe_payment_intent_id already exists in reservas.');
            } else {
                throw err;
            }
        }

        console.log('Migrations completed successfully.');
    } catch (error) {
        console.error('Error during migration:', error);
    } finally {
        process.exit();
    }
}

migrate();
