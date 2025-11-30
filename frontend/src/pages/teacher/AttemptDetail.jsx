import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getAttemptDetail, downloadText } from '../../services/teacherService';

const AttemptDetail = () => {
    const { attemptId } = useParams();
    const navigate = useNavigate();
    const [attempt, setAttempt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        fetchAttemptDetail();
    }, [attemptId]);

    const fetchAttemptDetail = async () => {
        try {
            setLoading(true);
            const response = await getAttemptDetail(attemptId);
            setAttempt(response.attempt);
        } catch (err) {
            console.error('Error al obtener detalle del intento:', err);
            setError(err.message || 'Error al cargar el detalle del intento');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        try {
            setDownloading(true);
            await downloadText(attempt.text.id, attempt.text.filename);
        } catch (err) {
            console.error('Error al descargar texto:', err);
            alert('Error al descargar el documento');
        } finally {
            setDownloading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getScoreBgColor = (score) => {
        if (score >= 80) return 'bg-green-900/30 border-green-500/50';
        if (score >= 60) return 'bg-yellow-900/30 border-yellow-500/50';
        return 'bg-red-900/30 border-red-500/50';
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="text-white text-xl">Cargando...</div>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="bg-red-900/30 border border-red-500/50 p-6 rounded-lg">
                    <p className="text-red-300">{error}</p>
                    <button
                        onClick={() => navigate('/teacher/students')}
                        className="mt-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                    >
                        Volver a Estudiantes
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    if (!attempt) return null;

    return (
        <DashboardLayout>
            {/* Breadcrumb */}
            <div className="mb-6 text-sm text-gray-400">
                <Link to="/teacher/students" className="hover:text-white">Mis Estudiantes</Link>
                <span className="mx-2">›</span>
                <Link to={`/teacher/students/${attempt.student.id}`} className="hover:text-white">
                    {attempt.student.nombre}
                </Link>
                <span className="mx-2">›</span>
                <span className="text-white">Detalle del Intento</span>
            </div>

            {/* Header */}
            <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 p-6 rounded-lg border-2 border-purple-500/50 mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            📝 Detalle del Intento
                        </h1>
                        <p className="text-gray-300">
                            <span className="font-semibold">Estudiante:</span> {attempt.student.nombre} ({attempt.student.correo})
                        </p>
                        <p className="text-gray-300">
                            <span className="font-semibold">Texto:</span> {attempt.text.filename}
                        </p>
                        <p className="text-gray-300">
                            <span className="font-semibold">Fecha:</span> {new Date(attempt.completedAt).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>
                    <div className={`text-right p-4 rounded-lg border-2 ${getScoreBgColor(attempt.totalScore)}`}>
                        <p className="text-gray-300 text-sm mb-1">Puntuación Total</p>
                        <p className={`text-4xl font-bold ${getScoreColor(attempt.totalScore)}`}>
                            {attempt.totalScore}
                        </p>
                        <p className="text-gray-400 text-sm">/ 100</p>
                    </div>
                </div>

                {/* Botón de descarga */}
                <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {downloading ? 'Descargando...' : 'Descargar Documento Original'}
                </button>
            </div>

            {/* Preguntas y Respuestas */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                    📚 Preguntas y Respuestas ({attempt.answers.length})
                </h2>

                {attempt.answers.map((answer, index) => (
                    <div
                        key={index}
                        className={`p-6 rounded-lg border-2 ${getScoreBgColor(answer.score)}`}
                    >
                        {/* Pregunta */}
                        <div className="mb-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-semibold text-purple-300">
                                    Pregunta {index + 1}
                                </h3>
                                <span className={`text-2xl font-bold ${getScoreColor(answer.score)}`}>
                                    {answer.score}/10
                                </span>
                            </div>
                            <p className="text-white bg-gray-800/60 p-4 rounded-lg">
                                {answer.questionText}
                            </p>
                        </div>

                        {/* Respuesta del Estudiante */}
                        <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-300 mb-2">
                                ✍️ Respuesta del Estudiante:
                            </h4>
                            <p className="text-gray-200 bg-gray-800/40 p-4 rounded-lg whitespace-pre-wrap">
                                {answer.userAnswer}
                            </p>
                        </div>

                        {/* Feedback de la IA */}
                        {answer.feedback && (
                            <div>
                                <h4 className="text-sm font-semibold text-gray-300 mb-2">
                                    🤖 Feedback de la IA:
                                </h4>
                                <p className="text-gray-300 bg-blue-900/20 p-4 rounded-lg border border-blue-500/30 whitespace-pre-wrap">
                                    {answer.feedback}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Botón Volver */}
            <div className="mt-8">
                <button
                    onClick={() => navigate(`/teacher/students/${attempt.student.id}`)}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                >
                    ← Volver al Perfil del Estudiante
                </button>
            </div>
        </DashboardLayout>
    );
};

export default AttemptDetail;
