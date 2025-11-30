const Enrollment = require('../model/enrollment');
const TextRecommendation = require('../model/textRecommendation');
const Usuario = require('../model/usuario');
const Attempt = require('../model/attempt');
const Text = require('../model/text');

/**
 * Servicio para gestionar la funcionalidad de profesores
 */

/**
 * Enrolar un estudiante con un profesor
 * @param {String} teacherId - ID del profesor
 * @param {String} studentEmail - Email del estudiante a enrolar
 */
const enrollStudent = async (teacherId, studentEmail) => {
    // 1. Buscar al estudiante por email
    const student = await Usuario.findOne({ correo: studentEmail, role: 'student' });

    if (!student) {
        const error = new Error('No se encontró un estudiante con ese email.');
        error.statusCode = 404;
        throw error;
    }

    // 2. Verificar que no esté ya enrolado
    const existingEnrollment = await Enrollment.findOne({
        teacher: teacherId,
        student: student._id
    });

    if (existingEnrollment) {
        if (existingEnrollment.isActive) {
            const error = new Error('Este estudiante ya está enrolado en tu clase.');
            error.statusCode = 409;
            throw error;
        } else {
            // Reactivar enrollment si estaba inactivo
            existingEnrollment.isActive = true;
            await existingEnrollment.save();
            return existingEnrollment;
        }
    }

    // 3. Crear nuevo enrollment
    const newEnrollment = new Enrollment({
        teacher: teacherId,
        student: student._id
    });

    await newEnrollment.save();
    return newEnrollment;
};

/**
 * Obtener todos los estudiantes enrolados de un profesor
 * @param {String} teacherId - ID del profesor
 */
const getEnrolledStudents = async (teacherId) => {
    const enrollments = await Enrollment.find({
        teacher: teacherId,
        isActive: true
    }).populate('student', 'nombre correo');

    return enrollments.map(enrollment => ({
        enrollmentId: enrollment._id,
        studentId: enrollment.student._id,
        nombre: enrollment.student.nombre,
        correo: enrollment.student.correo,
        enrolledAt: enrollment.enrolledAt
    }));
};

/**
 * Obtener el progreso detallado de un estudiante
 * @param {String} teacherId - ID del profesor
 * @param {String} studentId - ID del estudiante
 */
const getStudentProgress = async (teacherId, studentId) => {
    // 1. Verificar que el estudiante esté enrolado con este profesor
    const enrollment = await Enrollment.findOne({
        teacher: teacherId,
        student: studentId,
        isActive: true
    });

    if (!enrollment) {
        const error = new Error('Este estudiante no está enrolado en tu clase.');
        error.statusCode = 403;
        throw error;
    }

    // 2. Obtener todos los intentos del estudiante
    const attempts = await Attempt.find({ userId: studentId })
        .populate('textId', 'filename createdAt')
        .sort({ createdAt: -1 });

    // 3. Calcular estadísticas
    const totalAttempts = attempts.length;
    const averageScore = totalAttempts > 0
        ? attempts.reduce((sum, att) => sum + att.totalScore, 0) / totalAttempts
        : 0;

    // 4. Obtener textos únicos completados
    const uniqueTexts = [...new Set(attempts.map(att => att.textId._id.toString()))];

    return {
        studentId,
        totalAttempts,
        averageScore: Math.round(averageScore * 10) / 10, // Redondear a 1 decimal
        textsCompleted: uniqueTexts.length,
        attempts: attempts.map(att => ({
            attemptId: att._id,
            textId: att.textId._id,
            textFilename: att.textId.filename,
            score: att.totalScore,
            completedAt: att.createdAt,
            answersCount: att.answers.length
        }))
    };
};

/**
 * Obtener los textos subidos por un estudiante específico
 * @param {String} teacherId - ID del profesor
 * @param {String} studentId - ID del estudiante
 */
const getStudentTexts = async (teacherId, studentId) => {
    // 1. Verificar que el estudiante esté enrolado con este profesor
    const enrollment = await Enrollment.findOne({
        teacher: teacherId,
        student: studentId,
        isActive: true
    });

    if (!enrollment) {
        const error = new Error('Este estudiante no está enrolado en tu clase.');
        error.statusCode = 403;
        throw error;
    }

    // 2. Obtener todos los textos del estudiante
    const texts = await Text.find({ owner: studentId })
        .select('_id filename createdAt')
        .sort({ createdAt: -1 });

    return texts;
};

/**
 * Recomendar un texto a un estudiante
 * @param {String} teacherId - ID del profesor
 * @param {String} studentId - ID del estudiante
 * @param {String} textId - ID del texto a recomendar
 * @param {String} comment - Comentario opcional del profesor
 * @param {String} type - Tipo: 'recommendation' o 'assignment'
 * @param {Date} dueDate - Fecha límite (opcional)
 */
const recommendText = async (teacherId, studentId, textId, comment = '', type = 'recommendation', dueDate = null) => {
    // 1. Verificar que el estudiante esté enrolado
    const enrollment = await Enrollment.findOne({
        teacher: teacherId,
        student: studentId,
        isActive: true
    });

    if (!enrollment) {
        const error = new Error('Este estudiante no está enrolado en tu clase.');
        error.statusCode = 403;
        throw error;
    }

    // 2. Verificar que el texto exista
    const text = await Text.findById(textId);
    if (!text) {
        const error = new Error('El texto no existe.');
        error.statusCode = 404;
        throw error;
    }

    // 3. Crear la recomendación/asignación
    const recommendation = new TextRecommendation({
        teacher: teacherId,
        student: studentId,
        text: textId,
        comment: comment,
        type: type,
        dueDate: dueDate
    });

    await recommendation.save();
    return recommendation;
};

/**
 * Obtener todas las recomendaciones activas de un profesor
 * @param {String} teacherId - ID del profesor
 */
const getTeacherRecommendations = async (teacherId) => {
    const recommendations = await TextRecommendation.find({
        teacher: teacherId
    })
        .populate('student', 'nombre correo')
        .populate('text', 'filename')
        .sort({ createdAt: -1 });

    return recommendations.map(rec => ({
        recommendationId: rec._id,
        studentName: rec.student.nombre,
        studentEmail: rec.student.correo,
        textFilename: rec.text.filename,
        comment: rec.comment,
        status: rec.status,
        createdAt: rec.createdAt,
        completedAt: rec.completedAt
    }));
};

/**
 * Obtener recomendaciones pendientes para un estudiante
 * @param {String} studentId - ID del estudiante
 */
const getStudentRecommendations = async (studentId) => {
    const recommendations = await TextRecommendation.find({
        student: studentId,
        status: 'pending'
    })
        .populate('teacher', 'nombre')
        .populate('text', 'filename')
        .sort({ createdAt: -1 });

    return recommendations;
};

/**
 * Obtener recomendación de un texto específico para un estudiante
 * @param {String} studentId - ID del estudiante
 * @param {String} textId - ID del texto
 */
const getTextRecommendation = async (studentId, textId) => {
    const recommendation = await TextRecommendation.findOne({
        student: studentId,
        text: textId,
        status: 'pending'
    })
        .populate('teacher', 'nombre')
        .sort({ createdAt: -1 }); // Si hay múltiples, tomar la más reciente

    return recommendation;
};

/**
 * Obtener detalle completo de un intento específico
 * Verifica que el estudiante esté enrolado con el profesor
 */
const getAttemptDetail = async (teacherId, attemptId) => {
    const Attempt = require('../model/attempt');
    const Enrollment = require('../model/enrollment');

    // Buscar el intento y popular referencias
    const attempt = await Attempt.findById(attemptId)
        .populate('userId', 'nombre correo')
        .populate('textId', 'filename content createdAt');

    if (!attempt) {
        const error = new Error('Intento no encontrado.');
        error.statusCode = 404;
        throw error;
    }

    // Verificar que el estudiante esté enrolado con este profesor
    const enrollment = await Enrollment.findOne({
        teacher: teacherId,
        student: attempt.userId._id,
        isActive: true
    });

    if (!enrollment) {
        const error = new Error('No tienes permiso para ver este intento.');
        error.statusCode = 403;
        throw error;
    }

    return {
        attemptId: attempt._id,
        student: {
            id: attempt.userId._id,
            nombre: attempt.userId.nombre,
            correo: attempt.userId.correo
        },
        text: {
            id: attempt.textId._id,
            filename: attempt.textId.filename,
            createdAt: attempt.textId.createdAt
        },
        totalScore: attempt.totalScore,
        completedAt: attempt.createdAt,
        answers: attempt.answers.map(ans => ({
            questionText: ans.questionText,
            userAnswer: ans.userAnswer,
            score: ans.score,
            feedback: ans.feedback
        }))
    };
};

/**
 * Obtener contenido de un texto para descarga
 * Verifica que el owner del texto esté enrolado con el profesor
 */
const getTextForDownload = async (teacherId, textId) => {
    const Text = require('../model/text');
    const Enrollment = require('../model/enrollment');

    // Buscar el texto
    const text = await Text.findById(textId);

    if (!text) {
        const error = new Error('Texto no encontrado.');
        error.statusCode = 404;
        throw error;
    }

    // Verificar que el owner esté enrolado con este profesor
    const enrollment = await Enrollment.findOne({
        teacher: teacherId,
        student: text.owner,
        isActive: true
    });

    if (!enrollment) {
        const error = new Error('No tienes permiso para descargar este texto.');
        error.statusCode = 403;
        throw error;
    }

    return {
        filename: text.filename,
        content: text.content
    };
};

module.exports = {
    enrollStudent,
    getEnrolledStudents,
    getStudentProgress,
    getStudentTexts,
    recommendText,
    getTeacherRecommendations,
    getStudentRecommendations,
    getTextRecommendation,
    getAttemptDetail,
    getTextForDownload
};
