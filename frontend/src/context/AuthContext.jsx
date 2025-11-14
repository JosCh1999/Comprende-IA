import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Creamos el contexto
const AuthContext = createContext(null);

// 2. Creamos un hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Creamos el componente "Proveedor" que envolverá nuestra aplicación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  // El estado de carga es solo para la comprobación inicial al abrir la app
  const [loading, setLoading] = useState(true);

  // Este efecto se ejecuta UNA SOLA VEZ, cuando la aplicación se carga por primera vez.
  // Su único propósito es ver si ya existe una sesión en el navegador.
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        // Si encontramos datos, los cargamos en nuestro estado de React
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error al cargar datos de autenticación inicial", error);
      // Si algo falla (ej. datos corruptos), nos aseguramos de limpiar todo
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      // Haya o no datos, la carga inicial ha terminado.
      setLoading(false);
    }
  }, []); // El array vacío [] asegura que solo se ejecute al montar el componente.

  // --- LA LÓGICA SIMPLIFICADA Y CORRECTA ---

  // La función de login ahora es asíncrona y devuelve el usuario
  const login = async (userData, authToken) => {
    // 1. Guardar en el navegador
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
    // 2. Actualizar el estado de React
    setUser(userData);
    setToken(authToken);
    // 3. Devolver el usuario para que el componente que llama pueda actuar en consecuencia
    return userData;
  };

  // La función de logout sigue el mismo patrón simple:
  const logout = () => {
    // 1. Limpiar el navegador
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // 2. Limpiar el estado de React
    setUser(null);
    setToken(null);
  };

  // El objeto que compartimos con el resto de la app. Es simple y directo.
  const value = {
    user,
    token,
    loading,
    // Un usuario está autenticado si existe un token.
    isAuthenticated: !!token,
    login,
    logout,
  };

  // --- CORRECCIÓN CLAVE ---
  // Renderizamos SIEMPRE los componentes hijos. La lógica de "loading" ya es manejada
  // por los componentes que la necesitan (como ProtectedRoute), así que no necesitamos
  // bloquear el renderizado de toda la aplicación aquí.
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};