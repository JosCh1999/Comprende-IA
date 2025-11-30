
const attemptService = require('../services/attemptService');
const notificationService = require('../services/notificationService');
const Usuario = require('../model/usuario');
const Text = require('../model/text');

const createAttemptHandler = async (req, res) => {
    try {
        const userId = req.userId;
        const { textId, answers } = req.body;

        if (!userId || !textId || !answers || !Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({ message: "Faltan datos requeridos: se necesita userId, textId y un array de respuestas." });
        }

        const newAttempt = await attemptService.createAttempt(userId, textId, answers);

        // --- INTEGRACIÓN CON N8N (Flujo 2: Feedback y Motivación) ---
        // Enviar notificación a n8n de forma asíncrona (no bloqueante)
        (async () => {
            try {
                const student = await Usuario.findById(userId);
                const text = await Text.findById(textId);

                await notificationService.sendAttemptNotification({
                    student: {
                        id: student._id,
                        name: student.nombre,
                        email: student.correo
                    },
                    text: {
                        id: text._id,
                        title: text.filename,
                        summary: text.analysis ? text.analysis.resumen : "Sin resumen disponible"
                    },
                    attempt: {
                        id: newAttempt._id,
                        score: newAttempt.totalScore,
                        answersCount: newAttempt.answers.length
                    }
                });
            } catch (n8nError) {
                // No bloqueamos el flujo principal
                console.error('Error en notificación n8n:', n8nError.message);
            }
        })();

        res.status(201).json({
            message: "Intento evaluado y guardado correctamente.",
            attempt: newAttempt
        });

    } catch (error) {
        console.error("Error en el controlador al crear el intento:", error);
        res.status(500).json({
            message: "Error interno del servidor al procesar el intento.",
            error: error.message
        });
    }
};

/**
 * Manejador para buscar un intento específico de un usuario para un texto.
 */
const getAttemptByUserAndTextHandler = async (req, res) => {
    try {
        const userId = req.userId; // Obtenido del middleware verifyToken
        const { textId } = req.params; // Obtenido de la URL

        if (!textId) {
            return res.status(400).json({ message: "Falta el ID del texto." });
        }

        const attempt = await attemptService.findAttemptByUserAndText(userId, textId);

        if (!attempt) {
            // Si no se encuentra, es un caso de uso normal (el usuario no lo ha intentado todavía).
            // Un 404 es la respuesta HTTP correcta para "recurso no encontrado".
            return res.status(404).json({ message: "Aún no se ha realizado un intento para este texto." });
        }

        // Si se encuentra, se devuelve el intento.
        res.status(200).json(attempt);

    } catch (error) {
        console.error("Error en el controlador al buscar el intento:", error);
        res.status(500).json({
            message: "Error interno del servidor al buscar el intento.",
            error: error.message
        });
    }
};

module.exports = {
    createAttemptHandler,
    getAttemptByUserAndTextHandler // Exportamos el nuevo handler
}; 
