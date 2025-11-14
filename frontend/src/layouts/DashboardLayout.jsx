import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// --- Iconos SVG como componentes ---
const IntelliReadLogo = () => (
    <div className="flex items-center space-x-2">
        {/* Usaremos un ícono genérico por ahora */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <span className="text-2xl font-bold text-white">ComprendeAI</span>
    </div>
);

const UserProfile = ({ user }) => (
    <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
            {user?.nombre ? user.nombre.charAt(0).toUpperCase() : '?'}
        </div>
        <div>
            <p className="font-semibold text-white">{user?.nombre || 'User'}</p>
            <p className="text-sm text-gray-400">{user?.correo || 'user@example.com'}</p>
        </div>
    </div>
);

const LogoutButton = ({ onLogout }) => (
    <button onClick={onLogout} className="flex items-center w-full text-left space-x-3 text-gray-400 hover:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span>Log Out</span>
    </button>
);

// --- Componente Layout Principal ---
const DashboardLayout = ({ navLinks = [], children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-900 text-gray-200">
            {/* --- Sidebar --- */}
            <aside className="w-72 flex-shrink-0 bg-gray-800 p-6 flex flex-col justify-between">
                <div>
                    <IntelliReadLogo />
                    <nav className="mt-10">
                        <ul>
                            {navLinks.map((link, index) => {
                                const isActive = location.pathname.startsWith(link.path);
                                return (
                                    <li key={link.name} className={index > 0 ? 'mt-2' : ''}>
                                        <Link 
                                            to={link.path}
                                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive ? 'bg-blue-600 text-white font-semibold' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}>
                                            {link.icon}
                                            <span>{link.name}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>
                <div className="space-y-5 border-t border-gray-700 pt-6">
                    <UserProfile user={user} />
                    <LogoutButton onLogout={handleLogout} />
                </div>
            </aside>

            {/* --- Contenido Principal --- */}
            <main className="flex-1 p-10 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;