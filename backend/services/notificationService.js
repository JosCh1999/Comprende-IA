const axios = require('axios');

/**
 * Servicio para enviar notificaciones a n8n cuando ocurren eventos importantes.
 * Este servicio NO bloquea el flujo principal si falla.
 */

/**
 * Envía una notificación a n8n cuando un estudiante completa un intento.
 * @param {Object} attemptData - Datos del intento completado
 * @param {Object} attemptData.student - Información del estudiante
 * @param {Object} attemptData.text - Información del texto
 * @param {Object} attemptData.attempt - Información del intento (score, etc.)
 */
const sendAttemptNotification = async (attemptData) => {
    if (!process.env.N8N_WEBHOOK_URL) {
        console.warn('⚠️  N8N_WEBHOOK_URL no está configurada en .env. Saltando notificación a n8n.');
        return;
    }

    try {
        console.log(`📤 Enviando notificación a n8n para estudiante: ${attemptData.student.email}`);

        await axios.post(process.env.N8N_WEBHOOK_URL, {
            event: 'attempt_completed',
            timestamp: new Date().toISOString(),
            ...attemptData
        }, {
            timeout: 5000 // 5 segundos de timeout
        });

        console.log('✅ Webhook de n8n disparado exitosamente.');
    } catch (error) {
        // No bloqueamos el flujo principal si falla n8n
        console.error('❌ Error al enviar webhook a n8n:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('   → n8n no está accesible. Verifica que esté corriendo.');
        }
    }
};

module.exports = {
    sendAttemptNotification
};
