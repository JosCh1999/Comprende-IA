import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    correo: '',
    contraseña: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const { correo, contraseña } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: correo,
          password: contraseña
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Credenciales incorrectas');
      }
      
      // CORRECTO: Llamamos a login con el objeto de usuario y el token que está DENTRO de ese objeto.
      const user = await login(data.usuario, data.usuario.token);

      // CORRECTO: Usamos user.role para coincidir con el backend.
      if (user.role === 'student') {
        navigate('/student/dashboard');
      } else if (user.role === 'teacher') {
        navigate('/teacher/dashboard');
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
        <h2 className="text-2xl font-bold mt-4">Welcome Back</h2>
        <p className="text-gray-400">Sign in to access your dashboard and analyze texts.</p>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-md text-center">
            {error}
          </div>
        )}
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
        <div>
          <label htmlFor="contraseña" className="block text-sm font-medium text-gray-300">
            Password
          </label>
          <input
            id="contraseña"
            name="contraseña"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={contraseña}
            onChange={handleChange}
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </div>
      </form>
      <p className="text-sm text-center text-gray-400">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-blue-500 hover:underline">
          Sign Up
        </Link>
      </p>
    </>
  );
};

export default Login; 

