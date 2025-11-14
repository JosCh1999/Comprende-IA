import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente de Ruta Protegida.
 *
 * Este componente actúa como un guardián para las rutas que requieren autenticación y/o roles específicos.
 *
 * @param {object} props - Las propiedades del componente.
 * @param {React.ReactNode} props.children - El componente hijo que se renderizará si el usuario está autorizado.
 * @param {string[]} [props.allowedRoles] - Una lista opcional de roles permitidos para acceder a la ruta.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    // Mientras se carga la información de autenticación, no renderizamos nada
    // para evitar un parpadeo o una redirección incorrecta.
    if (loading) {
        return null; // O un componente de Spinner/Loading si lo prefieres
    }

    // 1. Verificar si el usuario está autenticado
    if (!isAuthenticated) {
        // Redirigir al login, pero guardando la ubicación a la que intentaba ir,
        // para poder redirigirlo de vuelta después de un inicio de sesión exitoso.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. Verificar si se requiere un rol específico y si el usuario lo tiene
    // CORRECTO: Se busca user.role (con 'e') para coincidir con el backend
    const userHasRequiredRole = user && allowedRoles && allowedRoles.includes(user.role);
    if (allowedRoles && !userHasRequiredRole) {
        // El usuario está autenticado pero no tiene el rol correcto.
        // Lo redirigimos a una página de "No Autorizado" o de vuelta al login.
        // Por simplicidad, lo enviamos al login por ahora.
        return <Navigate to="/login" replace />;
    }

    // Si todas las comprobaciones pasan, renderizar el componente hijo (la página solicitada).
    return children;
};

export default ProtectedRoute;