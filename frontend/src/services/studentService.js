import apiClient from './apiClient';

/**
 * Servicio para operaciones de estudiantes
 */

/**
 * Obtener recomendaciones de textos de los profesores
 */
export const getMyRecommendations = async () => {
    return await apiClient.get('/student/recommendations');
};

/**
 * Obtener recomendación de un texto específico
 * @param {string} textId - ID del texto
 */
export const getTextRecommendation = async (textId) => {
    return await apiClient.get(`/student/recommendations/${textId}`);
};

/**
 * Obtener todos los textos del estudiante
 */
export const getMyTexts = async () => {
    return await apiClient.get('/textos');
};

/**
 * Obtener un texto específico por ID
 * @param {string} textId - ID del texto
 */
export const getTextById = async (textId) => {
    return await apiClient.get(`/textos/${textId}`);
};

/**
 * Obtener el progreso del estudiante actual
 */
export const getMyProgress = async () => {
    return await apiClient.get('/student/progress');
};

export default {
    getMyRecommendations,
    getTextRecommendation,
    getMyTexts,
    getTextById,
    getMyProgress
};
