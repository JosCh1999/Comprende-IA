import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import * as studentService from '../../services/studentService';

// --- Iconos para la Navegación ---
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const EvaluationsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-4.586a1 1 0 01.293-.707l5.414-5.414a1 1 0 01.707-.293h4.586" /></svg>;
const ProgressIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;

const Progress = () => {
    const studentNavLinks = [
        { name: 'Subir Archivo', path: '/student/upload', icon: <UploadIcon /> },
        { name: 'Evaluaciones', path: '/student/evaluations', icon: <EvaluationsIcon /> },
        { name: 'Progreso', path: '/student/progress', icon: <ProgressIcon /> },
    ];

    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProgress();
    }, []);

    const fetchProgress = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await studentService.getMyProgress();
            setProgress(response.progress);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getScoreBgColor = (score) => {
        if (score >= 80) return 'bg-green-500/20 border-green-500/50';
        if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/50';
        return 'bg-red-500/20 border-red-500/50';
    };

    return (
        <DashboardLayout navLinks={studentNavLinks}>
            {/* Header de la página */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Mi Progreso</h1>
                <p className="text-gray-400 mt-1">Visualiza tu rendimiento y evolución a lo largo del tiempo.</p>
            </div>

            {loading && (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    <p className="text-gray-400 mt-4">Cargando tu progreso...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-900/30 border border-red-500 text-red-200 p-4 rounded-lg">
                    <p className="font-semibold">Error:</p>
                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && progress && (
                <>
                    {/* Tarjetas de Estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Total de Intentos */}
                        <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 p-6 rounded-lg border border-blue-500/50 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-300 text-sm font-medium">Total de Intentos</p>
                                    <p className="text-4xl font-bold text-white mt-2">{progress.totalAttempts}</p>
                                </div>
                                <div className="bg-blue-500/20 p-3 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Promedio General */}
                        <div className={`bg-gradient-to-br from-green-900/40 to-green-800/40 p-6 rounded-lg border border-green-500/50 shadow-lg`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-300 text-sm font-medium">Promedio General</p>
                                    <p className={`text-4xl font-bold mt-2 ${getScoreColor(progress.averageScore)}`}>
                                        {progress.averageScore}
                                        <span className="text-2xl text-gray-400">/100</span>
                                    </p>
                                </div>
                                <div className="bg-green-500/20 p-3 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Textos Completados */}
                        <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 p-6 rounded-lg border border-purple-500/50 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-300 text-sm font-medium">Textos Completados</p>
                                    <p className="text-4xl font-bold text-white mt-2">{progress.textsCompleted}</p>
                                </div>
                                <div className="bg-purple-500/20 p-3 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Historial de Evaluaciones */}
                    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-700">
                            <h2 className="text-2xl font-bold text-white">Historial de Evaluaciones</h2>
                            <p className="text-gray-400 mt-1">Todas tus evaluaciones ordenadas por fecha</p>
                        </div>

                        {progress.attempts.length === 0 ? (
                            <div className="p-12 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-gray-400 text-lg">Aún no has completado ninguna evaluación</p>
                                <p className="text-gray-500 mt-2">Sube un texto y responde las preguntas para comenzar</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-900/50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Texto</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Puntuación</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Preguntas</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {progress.attempts.map((attempt) => (
                                            <tr key={attempt.attemptId} className="hover:bg-gray-700/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <p className="text-white font-medium">{attempt.textFilename}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className={`inline-flex items-center px-3 py-1 rounded-full border ${getScoreBgColor(attempt.score)}`}>
                                                        <span className={`text-lg font-bold ${getScoreColor(attempt.score)}`}>
                                                            {attempt.score}
                                                        </span>
                                                        <span className="text-gray-400 text-sm ml-1">/100</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-gray-300">{attempt.answersCount} preguntas</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-gray-400">
                                                        {new Date(attempt.completedAt).toLocaleDateString('es-ES', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}
        </DashboardLayout>
    );
};

export default Progress;