
const Attempt = require('../model/attempt');
const { evaluateAnswer } = require('./aiService');

/**
 * HU-Eval: Crea un intento, evalúa cada respuesta con la IA y lo guarda en la BD.
 * @param {string} userId - El ID del usuario que realiza el intento.
 * @param {string} textId - El ID del texto al que se responde.
 * @param {Array<Object>} answers - Un array de objetos de respuesta del frontend.
 *                                  Formato esperado: [{ preguntaId, questionText, userAnswer }]
 * @returns {Promise<Object>} El documento de intento guardado.
 */
const createAttempt = async (userId, textId, answers) => {
    if (!userId || !textId || !answers || !Array.isArray(answers) || answers.length === 0) {
        throw new Error('Faltan datos obligatorios: userId, textId o un array de respuestas no vacío.');
    }

    const evaluatedAnswers = [];
    let totalScorePoints = 0;

    console.log(`Iniciando evaluación para ${answers.length} respuestas.`);

    // 1. Evaluar cada respuesta con la IA en paralelo.
    const evaluationPromises = answers.map(async (ans) => {
        try {
            // Llamamos a la función de la IA para obtener la evaluación.
            const evaluationResult = await evaluateAnswer(ans.questionText, ans.userAnswer);
            
            console.log(`Respuesta evaluada para pregunta ${ans.preguntaId}. Puntuación: ${evaluationResult.score}`);

            totalScorePoints += evaluationResult.score; // Sumamos los puntos obtenidos.

            return {
                preguntaId: ans.preguntaId,
                questionText: ans.questionText,
                userAnswer: ans.userAnswer,
                score: evaluationResult.score,
                feedback: evaluationResult.feedback
            };
        } catch (error) {
            console.error(`Error evaluando la pregunta ${ans.preguntaId}:`, error);
            // Si una evaluación falla, la marcamos con -1 para identificarla.
            // O se podría lanzar un error y cancelar todo el intento.
            return {
                preguntaId: ans.preguntaId,
                questionText: ans.questionText,
                userAnswer: ans.userAnswer,
                score: 0,
                feedback: 'Error al procesar la evaluación de esta respuesta.'
            };
        }
    });

    const resolvedEvaluations = await Promise.all(evaluationPromises);

    // 2. Calcular la puntuación final.
    const maxPossibleScore = answers.length * 5; // Asumiendo que la puntuación máxima de la IA es 5.
    const finalPercentage = (totalScorePoints / maxPossibleScore) * 100;

    console.log(`Evaluación completada. Puntuación total: ${totalScorePoints}/${maxPossibleScore} (${finalPercentage.toFixed(2)}%)`);

    // 3. Crear el documento de intento.
    const newAttempt = new Attempt({
        userId,
        textId,
        answers: resolvedEvaluations,
        totalScore: Math.round(finalPercentage) // Guardamos el porcentaje redondeado.
    });

    // 4. Guardar en la base de datos.
    try {
        const savedAttempt = await newAttempt.save();
        console.log('Nuevo intento guardado con ID:', savedAttempt._id);
        return savedAttempt;
    } catch (dbError) {
        console.error('Error al guardar el intento en la BD:', dbError);
        throw new Error('No se pudo guardar el intento en la base de datos.');
    }
};

/**
 * Busca si un usuario ya ha realizado un intento para un texto específico.
 * @param {string} userId - El ID del usuario.
 * @param {string} textId - El ID del texto.
 * @returns {Promise<Object|null>} El documento de intento si se encuentra, o null si no.
 */
const findAttemptByUserAndText = async (userId, textId) => {
    try {
        const attempt = await Attempt.findOne({ userId, textId });
        return attempt;
    } catch (error) {
        console.error('Error al buscar el intento:', error);
        throw new Error('Error en la base de datos al buscar el intento.');
    }
};

module.exports = { 
    createAttempt,
    findAttemptByUserAndText // Exportamos la nueva función
};