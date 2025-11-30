/**
 * Cliente HTTP centralizado para todas las llamadas a la API
 * Maneja automáticamente la autenticación y errores comunes
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

/**
 * Obtener el token de autenticación del localStorage
 */
const getAuthToken = () => {
    return localStorage.getItem('token');
};

/**
 * Realizar una petición HTTP con configuración común
 */
const request = async (endpoint, options = {}) => {
    const token = getAuthToken();

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        // Si la respuesta no es OK, lanzar error con el mensaje del servidor
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Error del servidor' }));
            throw new Error(errorData.message || `Error ${response.status}`);
        }

        // Intentar parsear JSON, si falla devolver null
        return await response.json().catch(() => null);

    } catch (error) {
        console.error(`Error en petición a ${endpoint}:`, error);
        throw error;
    }
};

/**
 * Métodos HTTP
 */
export const apiClient = {
    get: (endpoint) => request(endpoint, { method: 'GET' }),

    post: (endpoint, data) => request(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    put: (endpoint, data) => request(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),

    delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};

export default apiClient;
