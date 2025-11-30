import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import * as teacherService from '../../services/teacherService';

// --- Iconos SVG ---
const TeacherDashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

const StudentDetail = () => {
    const { studentId } = useParams();
    const teacherNavLinks = [
        { name: 'Mis Estudiantes', path: '/teacher/students', icon: <TeacherDashboardIcon /> },
        { name: 'Configuración', path: '/teacher/settings', icon: <SettingsIcon /> },
    ];

    const [progress, setProgress] = useState(null);
    const [availableTexts, setAvailableTexts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showRecommendModal, setShowRecommendModal] = useState(false);
    const [selectedTextId, setSelectedTextId] = useState('');
    const [recommendComment, setRecommendComment] = useState('');
    const [recommendType, setRecommendType] = useState('recommendation');
    const [dueDate, setDueDate] = useState('');
    const [recommending, setRecommending] = useState(false);

    useEffect(() => {
        fetchStudentProgress();
        fetchAvailableTexts();
    }, [studentId]);

    const fetchStudentProgress = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await teacherService.getStudentProgress(studentId);
            setProgress(response.progress);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableTexts = async () => {
        try {
            const response = await teacherService.getStudentTexts(studentId);
            setAvailableTexts(response.texts || []);
        } catch (err) {
            console.error('Error al cargar textos del estudiante:', err);
        }
    };

    const handleRecommendText = async (e) => {
        e.preventDefault();
        setRecommending(true);

        try {
            await teacherService.recommendText(studentId, selectedTextId, recommendComment, recommendType, dueDate);
            setShowRecommendModal(false);
            setSelectedTextId('');
            setRecommendComment('');
            setRecommendType('recommendation');
            setDueDate('');
            alert(recommendType === 'assignment' ? 'Texto asignado exitosamente' : 'Texto recomendado exitosamente');
        } catch (err) {
            alert(`Error: ${err.message}`);
        } finally {
            setRecommending(false);
        }
    };

    const handleExportExcel = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:4000/teacher/students/${studentId}/export/excel`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Error al exportar');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `progreso_estudiante.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            alert('Error al exportar el archivo: ' + err.message);
        }
    };

    if (loading) {
        return (
            <DashboardLayout navLinks={teacherNavLinks}>
                <p className="text-center text-gray-400">Cargando progreso del estudiante...</p>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout navLinks={teacherNavLinks}>
                <div className="bg-red-900/50 border border-red-500 text-white p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-2">Error</h3>
                    <p>{error}</p>
                    <Link to="/teacher/students" className="text-blue-400 hover:underline mt-4 inline-block">
                        ← Volver a la lista
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout navLinks={teacherNavLinks}>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <Link to="/teacher/students" className="text-blue-400 hover:underline mb-2 inline-block">
                        ← Volver a Mis Estudiantes
                    </Link>
                    <h1 className="text-3xl font-bold text-white">Progreso del Estudiante</h1>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExportExcel}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Exportar Excel
                    </button>
                    <button
                        onClick={() => setShowRecommendModal(true)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
                    >
                        Recomendar Texto
                    </button>
                </div>
            </div>

            {/* Estadísticas Generales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-white text-sm font-medium mb-2">Total de Intentos</h3>
                    <p className="text-4xl font-bold text-white">{progress?.totalAttempts || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-white text-sm font-medium mb-2">Promedio General</h3>
                    <p className="text-4xl font-bold text-white">{progress?.averageScore || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-white text-sm font-medium mb-2">Textos Completados</h3>
                    <p className="text-4xl font-bold text-white">{progress?.textsCompleted || 0}</p>
                </div>
            </div>

            {/* Historial de Intentos */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-6">Historial de Evaluaciones</h2>
                {progress?.attempts && progress.attempts.length > 0 ? (
                    <div className="space-y-4">
                        {progress.attempts.map((attempt) => (
                            <div
                                key={attempt.attemptId}
                                className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex justify-between items-center"
                            >
                                <div>
                                    <h3 className="text-white font-semibold">{attempt.textFilename}</h3>
                                    <p className="text-gray-400 text-sm">
                                        {new Date(attempt.completedAt).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                    <p className="text-gray-500 text-xs mt-1">
                                        {attempt.answersCount} preguntas respondidas
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className={`text-3xl font-bold ${attempt.score >= 80 ? 'text-green-400' :
                                            attempt.score >= 60 ? 'text-yellow-400' :
                                                'text-red-400'
                                            }`}>
                                            {attempt.score}
                                        </p>
                                        <p className="text-gray-400 text-sm">/ 100</p>
                                    </div>
                                    <Link
                                        to={`/teacher/attempts/${attempt.attemptId}`}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                        Ver Detalles
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-400">El estudiante aún no ha completado ninguna evaluación.</p>
                )}
            </div>

            {/* Modal de Recomendación */}
            {showRecommendModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
                        <h2 className="text-2xl font-bold text-white mb-4">Recomendar Texto</h2>
                        <form onSubmit={handleRecommendText}>
                            <div className="mb-4">
                                <label className="block text-gray-300 mb-2">Selecciona un Texto</label>
                                <select
                                    value={selectedTextId}
                                    onChange={(e) => setSelectedTextId(e.target.value)}
                                    className="w-full bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                    required
                                    disabled={recommending}
                                >
                                    <option value="">-- Selecciona un texto --</option>
                                    {availableTexts.map((text) => (
                                        <option key={text._id} value={text._id}>
                                            {text.filename}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-300 mb-2">Tipo de Acción</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center text-gray-300 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="type"
                                            value="recommendation"
                                            checked={recommendType === 'recommendation'}
                                            onChange={(e) => setRecommendType(e.target.value)}
                                            className="mr-2 text-green-500 focus:ring-green-500"
                                        />
                                        Recomendación
                                    </label>
                                    <label className="flex items-center text-gray-300 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="type"
                                            value="assignment"
                                            checked={recommendType === 'assignment'}
                                            onChange={(e) => setRecommendType(e.target.value)}
                                            className="mr-2 text-green-500 focus:ring-green-500"
                                        />
                                        Asignación (Tarea)
                                    </label>
                                </div>
                            </div>

                            {recommendType === 'assignment' && (
                                <div className="mb-4">
                                    <label className="block text-gray-300 mb-2">Fecha Límite</label>
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                        required={recommendType === 'assignment'}
                                    />
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="block text-gray-300 mb-2">Comentario (opcional)</label>
                                <textarea
                                    value={recommendComment}
                                    onChange={(e) => setRecommendComment(e.target.value)}
                                    className="w-full bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                    rows="3"
                                    placeholder="Escribe un comentario para el estudiante..."
                                    maxLength="500"
                                    disabled={recommending}
                                />
                                <p className="text-gray-500 text-xs mt-1">{recommendComment.length}/500 caracteres</p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowRecommendModal(false);
                                        setSelectedTextId('');
                                        setRecommendComment('');
                                        setRecommendType('recommendation');
                                        setDueDate('');
                                    }}
                                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
                                    disabled={recommending}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed"
                                    disabled={recommending}
                                >
                                    {recommending ? 'Procesando...' : (recommendType === 'assignment' ? 'Asignar' : 'Recomendar')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default StudentDetail;
