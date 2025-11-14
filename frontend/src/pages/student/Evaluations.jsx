
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // <-- 1. IMPORTAMOS Link
import DashboardLayout from '../../layouts/DashboardLayout';

// --- Iconos (sin cambios) ---
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const EvaluationsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-4.586a1 1 0 01.293-.707l5.414-5.414a1 1 0 01.707-.293h4.586"/></svg>;
const ProgressIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;

const Evaluations = () => {
    // --- Navegación y Hooks de estado (sin cambios) ---
    const studentNavLinks = [
        { name: 'Subir Archivo', path: '/student/upload', icon: <UploadIcon /> },
        { name: 'Evaluaciones', path: '/student/evaluations', icon: <EvaluationsIcon /> },
        { name: 'Progreso', path: '/student/progress', icon: <ProgressIcon /> },
    ];
    const [texts, setTexts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- useEffect para obtener datos (sin cambios) ---
    useEffect(() => {
        const fetchTexts = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('No autenticado.');

                const response = await fetch('http://localhost:4000/textos', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);

                const data = await response.json();
                if (!Array.isArray(data.texts)) throw new Error('La respuesta de la API no es válida.');
                
                setTexts(data.texts);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTexts();
    }, []);

    // --- Lógica de renderizado (con el cambio en el botón) ---
    const renderContent = () => {
        if (loading) return <p className="text-center text-gray-400">Cargando...</p>;
        if (error) return <p className="text-center text-red-500">Error: {error}</p>;
        if (texts.length === 0) return <p className="text-center text-gray-400">No hay evaluaciones todavía.</p>;

        return (
            <div className="space-y-4">
                {texts.map((text) => (
                    <div key={text._id} className="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center">
                        <p className="text-white font-medium">{text.filename}</p>
                        {/* --- 2. ENVOLVEMOS el botón con el Link --- */}
                        <Link to={`/student/evaluations/${text._id}`} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200">
                            Ver Detalles
                        </Link>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <DashboardLayout navLinks={studentNavLinks}>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Mis Evaluaciones</h1>
                <p className="text-gray-400 mt-1">Revisa los textos que has analizado, tus respuestas y el feedback de la IA.</p>
            </div>
            <div>
                {renderContent()}
            </div>
        </DashboardLayout>
    );
};

export default Evaluations;