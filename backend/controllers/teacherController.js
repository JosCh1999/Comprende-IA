const teacherService = require('../services/teacherService');

/**
 * Enrolar un estudiante en la clase del profesor
 * POST /teacher/students/enroll
 * Body: { studentEmail: "estudiante@example.com" }
 */
const enrollStudentHandler = async (req, res) => {
    try {
        const teacherId = req.userId; // Del middleware verifyToken
        const { studentEmail } = req.body;

        if (!studentEmail) {
            return res.status(400).json({ message: 'El email del estudiante es requerido.' });
        }

        const enrollment = await teacherService.enrollStudent(teacherId, studentEmail);

        res.status(201).json({
            message: 'Estudiante enrolado exitosamente.',
            enrollment
        });

    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.error('Error al enrolar estudiante:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

/**
 * Obtener lista de estudiantes enrolados
 * GET /teacher/students
 */
const getEnrolledStudentsHandler = async (req, res) => {
    try {
        const teacherId = req.userId;
        const students = await teacherService.getEnrolledStudents(teacherId);

        res.status(200).json({
            message: 'Estudiantes obtenidos exitosamente.',
            students
        });

    } catch (error) {
        console.error('Error al obtener estudiantes:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

/**
 * Obtener progreso de un estudiante específico
 * GET /teacher/students/:studentId/progress
 */
const getStudentProgressHandler = async (req, res) => {
    try {
        const teacherId = req.userId;
        const { studentId } = req.params;

        const progress = await teacherService.getStudentProgress(teacherId, studentId);

        res.status(200).json({
            message: 'Progreso obtenido exitosamente.',
            progress
        });

    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.error('Error al obtener progreso:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

/**
 * Recomendar o asignar un texto a un estudiante
 * POST /teacher/students/:studentId/recommend
 * Body: { textId: "...", comment: "...", type: "recommendation" | "assignment", dueDate: "YYYY-MM-DD" }
 */
const recommendTextHandler = async (req, res) => {
    try {
        const teacherId = req.userId;
        const { studentId } = req.params;
        const { textId, comment, type, dueDate } = req.body;

        if (!textId) {
            return res.status(400).json({ message: 'El ID del texto es requerido.' });
        }

        const recommendation = await teacherService.recommendText(
            teacherId,
            studentId,
            textId,
            comment,
            type,
            dueDate
        );

        res.status(201).json({
            message: type === 'assignment' ? 'Texto asignado exitosamente.' : 'Texto recomendado exitosamente.',
            recommendation
        });

    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.error('Error al recomendar/asignar texto:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

/**
 * Obtener los textos de un estudiante específico
 * GET /teacher/students/:studentId/texts
 */
const getStudentTextsHandler = async (req, res) => {
    try {
        const teacherId = req.userId;
        const { studentId } = req.params;

        const texts = await teacherService.getStudentTexts(teacherId, studentId);

        res.status(200).json({
            message: 'Textos del estudiante obtenidos exitosamente.',
            texts
        });

    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.error('Error al obtener textos del estudiante:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

/**
 * Obtener recomendación de un texto específico
 * GET /teacher/recommendations/:textId
 */
const getTextRecommendationHandler = async (req, res) => {
    try {
        const teacherId = req.userId;
        const { textId } = req.params;

        const recommendation = await teacherService.getTextRecommendation(teacherId, textId);

        res.status(200).json({
            message: 'Recomendación obtenida exitosamente.',
            recommendation
        });

    } catch (error) {
        console.error('Error al obtener recomendación del texto:', error);
        res.status(error.statusCode || 500).json({
            message: error.message || 'Error interno del servidor.'
        });
    }
};

/**
 * Obtener detalle completo de un intento
 * GET /teacher/attempts/:attemptId
 */
const getAttemptDetailHandler = async (req, res) => {
    try {
        const teacherId = req.userId;
        const { attemptId } = req.params;

        const attemptDetail = await teacherService.getAttemptDetail(teacherId, attemptId);

        res.status(200).json({
            message: 'Detalle del intento obtenido exitosamente.',
            attempt: attemptDetail
        });

    } catch (error) {
        console.error('Error al obtener detalle del intento:', error);
        res.status(error.statusCode || 500).json({
            message: error.message || 'Error interno del servidor.'
        });
    }
};

/**
 * Descargar contenido de un texto
 * GET /teacher/texts/:textId/download
 */
const downloadTextHandler = async (req, res) => {
    try {
        const teacherId = req.userId;
        const { textId } = req.params;

        const textData = await teacherService.getTextForDownload(teacherId, textId);

        // Configurar headers para descarga
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${textData.filename}.txt"`);

        res.send(textData.content);

    } catch (error) {
        console.error('Error al descargar texto:', error);
        res.status(error.statusCode || 500).json({
            message: error.message || 'Error interno del servidor.'
        });
    }
};

module.exports = {
    enrollStudentHandler,
    getEnrolledStudentsHandler,
    getStudentProgressHandler,
    recommendTextHandler,
    getStudentTextsHandler,
    getTextRecommendationHandler,
    getAttemptDetailHandler,
    downloadTextHandler
};
