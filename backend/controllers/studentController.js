const teacherService = require('../services/teacherService');

/**
 * Obtener recomendaciones pendientes para el estudiante actual
 * GET /student/recommendations
 */
const getMyRecommendationsHandler = async (req, res) => {
    try {
        const studentId = req.userId; // Del middleware verifyToken
        const recommendations = await teacherService.getStudentRecommendations(studentId);

        res.status(200).json({
            message: 'Recomendaciones obtenidas exitosamente.',
            recommendations: recommendations.map(rec => ({
                recommendationId: rec._id,
                teacherName: rec.teacher.nombre,
                textId: rec.text._id,
                textFilename: rec.text.filename,
                comment: rec.comment,
                type: rec.type,
                dueDate: rec.dueDate,
                createdAt: rec.createdAt
            }))
        });

    } catch (error) {
        console.error('Error al obtener recomendaciones del estudiante:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

/**
 * Obtener recomendación de un texto específico
 * GET /student/recommendations/:textId
 */
const getTextRecommendationHandler = async (req, res) => {
    try {
        const studentId = req.userId;
        const { textId } = req.params;

        const recommendation = await teacherService.getTextRecommendation(studentId, textId);

        if (!recommendation) {
            return res.status(200).json({
                message: 'No hay recomendación para este texto.',
                recommendation: null
            });
        }

        res.status(200).json({
            message: 'Recomendación obtenida exitosamente.',
            recommendation: {
                recommendationId: recommendation._id,
                teacherName: recommendation.teacher.nombre,
                comment: recommendation.comment,
                createdAt: recommendation.createdAt
            }
        });

    } catch (error) {
        console.error('Error al obtener recomendación del texto:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

/**
 * Obtener el progreso del estudiante actual
 * GET /student/progress
 */
const getMyProgressHandler = async (req, res) => {
    try {
        const studentId = req.userId;
        const Attempt = require('../model/attempt');
        const Text = require('../model/text');

        // Obtener todos los intentos del estudiante
        const attempts = await Attempt.find({ userId: studentId })
            .populate('textId', 'filename')
            .sort({ createdAt: -1 });

        // Calcular estadísticas
        const totalAttempts = attempts.length;
        const averageScore = totalAttempts > 0
            ? attempts.reduce((sum, att) => sum + att.totalScore, 0) / totalAttempts
            : 0;

        // Textos únicos completados
        const uniqueTexts = [...new Set(attempts.map(att => att.textId?._id?.toString()).filter(Boolean))];

        res.status(200).json({
            message: 'Progreso obtenido exitosamente.',
            progress: {
                totalAttempts,
                averageScore: Math.round(averageScore * 10) / 10,
                textsCompleted: uniqueTexts.length,
                attempts: attempts.map(att => ({
                    attemptId: att._id,
                    textFilename: att.textId?.filename || 'Texto eliminado',
                    score: att.totalScore,
                    completedAt: att.createdAt,
                    answersCount: att.answers?.length || 0
                }))
            }
        });

    } catch (error) {
        console.error('Error al obtener progreso del estudiante:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

module.exports = {
    getMyRecommendationsHandler,
    getTextRecommendationHandler,
    getMyProgressHandler
};
