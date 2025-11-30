import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import * as studentService from '../../services/studentService';

// --- Iconos ---
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const EvaluationsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-4.586a1 1 0 01.293-.707l5.414-5.414a1 1 0 01.707-.293h4.586" /></svg>;
const ProgressIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;

const Evaluations = () => {
    const studentNavLinks = [
        { name: 'Subir Archivo', path: '/student/upload', icon: <UploadIcon /> },
        { name: 'Evaluaciones', path: '/student/evaluations', icon: <EvaluationsIcon /> },
        { name: 'Progreso', path: '/student/progress', icon: <ProgressIcon /> },
    ];

    const [texts, setTexts] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('No autenticado.');

                // 1. Obtener textos propios
                const textsResponse = await fetch('http://localhost:4000/textos', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (!textsResponse.ok) throw new Error(`Error al obtener textos: ${textsResponse.status}`);
                const textsData = await textsResponse.json();

                // 2. Obtener recomendaciones/asignaciones
                const recsResponse = await studentService.getMyRecommendations();

                setTexts(textsData.texts || []);
                setRecommendations(recsResponse.recommendations || []);

            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const assignments = recommendations.filter(r => r.type === 'assignment');
    const standardRecommendations = recommendations.filter(r => r.type !== 'assignment');

    if (loading) {
        return (
            <DashboardLayout navLinks={studentNavLinks}>
                <p className="text-center text-gray-400">Cargando evaluaciones...</p>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout navLinks={studentNavLinks}>
                <div className="bg-red-900/50 border border-red-500 text-white p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-2">Error</h3>
                    <p>{error}</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout navLinks={studentNavLinks}>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Mis Evaluaciones</h1>
                <p className="text-gray-400 mt-1">Gestiona tus textos, tareas asignadas y recomendaciones.</p>
            </div>

            {/* Sección de Tareas Asignadas */}
            {assignments.length > 0 && (
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="text-yellow-400">⚡</span> Tareas Asignadas
                    </h2>
                    <div className="grid gap-4">
                        {assignments.map((assign) => (
                            <div key={assign.recommendationId} className="bg-gray-800 border-l-4 border-yellow-500 p-6 rounded-r-lg shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{assign.textFilename}</h3>
                                    <p className="text-gray-400 text-sm mt-1">Asignado por: <span className="text-gray-300">{assign.teacherName}</span></p>
                                    {assign.dueDate && (
                                        <p className="text-yellow-400 text-sm mt-1 font-semibold">
                                            Fecha límite: {new Date(assign.dueDate).toLocaleDateString()}
                                        </p>
                                    )}
                                    {assign.comment && (
                                        <p className="text-gray-300 mt-2 italic">"{assign.comment}"</p>
                                    )}
                                </div>
                                <Link
                                    to={`/student/evaluations/${assign.textId}`}
                                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-md whitespace-nowrap"
                                >
                                    Comenzar Tarea
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Sección de Recomendaciones */}
            {standardRecommendations.length > 0 && (
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="text-green-400">💡</span> Recomendaciones
                    </h2>
                    <div className="grid gap-4">
                        {standardRecommendations.map((rec) => (
                            <div key={rec.recommendationId} className="bg-gray-800 border-l-4 border-green-500 p-6 rounded-r-lg shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{rec.textFilename}</h3>
                                    <p className="text-gray-400 text-sm mt-1">Recomendado por: <span className="text-gray-300">{rec.teacherName}</span></p>
                                    {rec.comment && (
                                        <p className="text-gray-300 mt-2 italic">"{rec.comment}"</p>
                                    )}
                                </div>
                                <Link
                                    to={`/student/evaluations/${rec.textId}`}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-md whitespace-nowrap"
                                >
                                    Ver Recomendación
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Sección de Mis Textos */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-4">Mis Textos Analizados</h2>
                {texts.length === 0 ? (
                    <div className="bg-gray-800 p-8 rounded-lg text-center">
                        <p className="text-gray-400 mb-4">No has subido ningún texto todavía.</p>
                        <Link to="/student/upload" className="text-blue-400 hover:underline font-semibold">
                            Subir mi primer texto →
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {texts.map((text) => (
                            <div key={text._id} className="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center hover:bg-gray-750 transition-colors">
                                <div>
                                    <p className="text-white font-medium text-lg">{text.filename}</p>
                                    <p className="text-gray-500 text-xs">Subido el {new Date(text.createdAt).toLocaleDateString()}</p>
                                </div>
                                <Link
                                    to={`/student/evaluations/${text._id}`}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                                >
                                    Ver Detalles
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Evaluations;