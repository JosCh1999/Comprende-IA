import apiClient from './apiClient';

/**
 * Servicio para todas las operaciones de profesores
 */

/**
 * Enrolar un estudiante en la clase del profesor
 * @param {string} studentEmail - Email del estudiante
 */
export const enrollStudent = async (studentEmail) => {
    return await apiClient.post('/teacher/students/enroll', { studentEmail });
};

/**
 * Obtener lista de estudiantes enrolados
 */
export const getEnrolledStudents = async () => {
    return await apiClient.get('/teacher/students');
};

/**
 * Obtener progreso detallado de un estudiante
 * @param {string} studentId - ID del estudiante
 */
export const getStudentProgress = async (studentId) => {
    return await apiClient.get(`/teacher/students/${studentId}/progress`);
};

/**
 * Obtener textos subidos por un estudiante
 * @param {string} studentId - ID del estudiante
 */
export const getStudentTexts = async (studentId) => {
    return await apiClient.get(`/teacher/students/${studentId}/texts`);
};

/**
 * Recomendar un texto a un estudiante
 * @param {string} studentId - ID del estudiante
 * @param {string} textId - ID del texto
 * @param {string} comment - Comentario opcional
 */
export const recommendText = async (studentId, textId, comment = '', type = 'recommendation', dueDate = null) => {
    return await apiClient.post(`/teacher/students/${studentId}/recommend`, {
        textId,
        comment,
        type,
        dueDate
    });
};

/**
 * Obtener recomendación de un texto específico
 */
export const getTextRecommendation = async (textId) => {
    return await apiClient.get(`/teacher/recommendations/${textId}`);
};

/**
 * Obtener detalle completo de un intento
 */
export const getAttemptDetail = async (attemptId) => {
    return await apiClient.get(`/teacher/attempts/${attemptId}`);
};

/**
 * Descargar contenido de un texto
 */
export const downloadText = async (textId, filename) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:4000/teacher/texts/${textId}/download`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        throw new Error('Error al descargar el texto');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};

export default {
    enrollStudent,
    getEnrolledStudents,
    getStudentProgress,
    getStudentTexts,
    recommendText,
    getTextRecommendation,
    getAttemptDetail,
    downloadText
};
