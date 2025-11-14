import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contraseña: '',
    confirmarContraseña: '',
    role: 'student' // 1. Añadimos el rol al estado inicial
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // Sacamos 'role' del estado
  const { nombre, correo, contraseña, confirmarContraseña, role } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (contraseña !== confirmarContraseña) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:4000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 3. Enviamos el rol seleccionado dinámicamente
        body: JSON.stringify({ 
          nombre: nombre,      
          email: correo,        
          password: contraseña, 
          role: role 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar el usuario.');
      }
      
      login(data.usuario, data.usuario.token);

      if (data.usuario.role === 'student') {
        navigate('/student/dashboard');
      } else if (data.usuario.role === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/login');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-bold">ComprendeAI</h1>
        <h2 className="text-2xl font-bold mt-4">Create Account</h2>
        <p className="text-gray-400">Sign up to get started.</p>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-md text-center">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-300">
            Nombre
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            autoComplete="name"
            required
            placeholder="Tu Nombre"
            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={nombre}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="correo" className="block text-sm font-medium text-gray-300">
            Email
          </label>
          <input
            id="correo"
            name="correo"
            type="email"
            autoComplete="email"
            required
            placeholder="name@example.com"
            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={correo}
            onChange={handleChange}
          />
        </div>
        {/* 2. Añadimos el campo de selección de rol */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-300">
            Soy
          </label>
          <select
            id="role"
            name="role"
            required
            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={role}
            onChange={handleChange}
          >
            <option value="student">Estudiante</option>
            <option value="teacher">Docente</option>
          </select>
        </div>
        <div>
          <label htmlFor="contraseña" className="block text-sm font-medium text-gray-300">
            Password
          </label>
          <input
            id="contraseña"
            name="contraseña"
            type="password"
            autoComplete="new-password"
            required
            placeholder="••••••••"
            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={contraseña}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="confirmarContraseña" className="block text-sm font-medium text-gray-300">
            Confirm Password
          </label>
          <input
            id="confirmarContraseña"
            name="confirmarContraseña"
            type="password"
            autoComplete="new-password"
            required
            placeholder="••••••••"
            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={confirmarContraseña}
            onChange={handleChange}
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </div>
      </form>
      <p className="text-sm text-center text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-blue-500 hover:underline">
          Sign In
        </Link>
      </p>
    </>
  );
};

export default Register;




