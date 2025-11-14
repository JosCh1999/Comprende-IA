
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';

// --- Iconos ---
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const EvaluationsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-4.586a1 1 0 01.293-.707l5.414-5.414a1 1 0 01.707-.293h4.586"/></svg>;
const ProgressIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;

const EvaluationDetail = () => {
    const studentNavLinks = [
        { name: 'Subir Archivo', path: '/student/upload', icon: <UploadIcon /> },
        { name: 'Evaluaciones', path: '/student/evaluations', icon: <EvaluationsIcon /> },
        { name: 'Progreso', path: '/student/progress', icon: <ProgressIcon /> },
    ];

    const { textId } = useParams();
    const [evaluationText, setEvaluationText] = useState(null); // Contenido del texto y análisis
    const [existingAttempt, setExistingAttempt] = useState(null); // Intento previo del usuario
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // --- Lógica de Carga de Datos ---
    const fetchEvaluationData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No autenticado. Por favor, inicia sesión.');

            // 1. Comprobar si ya existe un intento para este usuario y texto
            const attemptResponse = await fetch(`http://localhost:4000/attempts/${textId}/my-attempt`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (attemptResponse.ok) {
                const attemptData = await attemptResponse.json();
                setExistingAttempt(attemptData);
            } else if (attemptResponse.status !== 404) {
                // Si el error no es 404 (No encontrado), es un error real del servidor
                throw new Error('Error al verificar intentos previos.');
            }

            // 2. Cargar los datos del texto (resumen, falacias, preguntas)
            const textResponse = await fetch(`http://localhost:4000/textos/${textId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!textResponse.ok) throw new Error(`Error al cargar la evaluación: ${textResponse.status}`);
            const textData = await textResponse.json();
            setEvaluationText(textData.text);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [textId]);

    useEffect(() => {
        fetchEvaluationData();
    }, [fetchEvaluationData]);

    // --- Lógica de Envío de Respuestas ---
    const handleAnswerChange = (preguntaId, value) => {
        setUserAnswers(prev => ({ ...prev, [preguntaId]: value }));
    };

    const handleSubmitAnswers = async () => {
        const preguntas = evaluationText?.analysis?.preguntas || [];
        const answersToSubmit = preguntas
            .map(p => ({ preguntaId: p._id, questionText: p.question, userAnswer: userAnswers[p._id] || '' }))
            .filter(a => a.userAnswer.trim() !== '');
        
        if (answersToSubmit.length < preguntas.length) {
            alert('Por favor, responde todas las preguntas antes de enviar.');
            return;
        }

        setIsSubmitting(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:4000/attempts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ textId: evaluationText._id, answers: answersToSubmit }),
            });

            if (!response.ok) throw new Error((await response.json()).message || 'Error al enviar.');

            // Envío exitoso, recargamos los datos para mostrar la vista de feedback.
            alert('¡Tus respuestas han sido evaluadas! A continuación verás tu feedback.');
            fetchEvaluationData(); // Esto buscará el intento recién creado y cambiará la vista

        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // --- Renderizado Condicional del Contenido ---
    const renderContent = () => {
        if (loading) return <p className="text-center text-gray-400">Cargando detalles de la evaluación...</p>;
        if (error) return <div className="bg-red-900 border border-red-500 text-white p-6 rounded-lg"><h2 className="text-xl font-bold mb-2">Error</h2><p>{error}</p></div>;
        if (!evaluationText) return <p className="text-center text-gray-400">No se encontraron datos.</p>;

        const { filename, analysis } = evaluationText;
        const { resumen, falacias, preguntas } = analysis || {};

        // Si existe un intento, mostramos el feedback. Si no, el formulario.
        const hasAttempt = !!existingAttempt;

        return (
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold text-white mb-8">Análisis del texto: {filename}</h2>

                {/* Resumen y Falacias (se muestran en ambos casos) */}
                {resumen && (
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-blue-400 mb-4">Resumen</h3>
                        <div className="bg-gray-900 p-4 rounded-md border border-gray-700"><p className="text-gray-300 whitespace-pre-wrap">{resumen}</p></div>
                    </div>
                )}
                {falacias && falacias.length > 0 && (
                     <div className="mb-8">
                        <h3 className="text-2xl font-bold text-red-400 mb-4">Falacias Detectadas</h3>
                        <ul className="space-y-4">
                            {falacias.map((falacia, index) => (
                                <li key={index} className="bg-gray-900 p-4 rounded-md border border-gray-700">
                                    <strong className='font-semibold text-red-500'>{falacia.tipo}</strong>
                                    <p className="text-gray-300 mt-1">{falacia.descripcion}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                
                {/* Sección de Preguntas (renderizado condicional) */}
                <div className="mt-8">
                    <h3 className="text-2xl font-bold text-green-400 mb-6">{hasAttempt ? "Resultado de tu Evaluación" : "Preguntas para tu Evaluación"}</h3>
                    {hasAttempt && (
                        <div className='mb-8 bg-blue-900/50 border border-blue-500 p-4 rounded-lg text-center'>
                            <p className='text-lg text-white'>Ya has completado esta evaluación.</p>
                            <p className='text-3xl font-bold text-white mt-2'>Puntuación Final: <span className='text-yellow-400'>{existingAttempt.totalScore} / 100</span></p>
                        </div>
                    )}

                    {preguntas && preguntas.length > 0 ? (
                        <div className="space-y-8">
                            {preguntas.map((pregunta) => {
                                const attemptAnswer = hasAttempt ? existingAttempt.answers.find(a => a.preguntaId === pregunta._id) : null;
                                return (
                                    <div key={pregunta._id} className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                                        <label className="block text-lg text-gray-300 mb-3">
                                            <strong className='font-semibold text-blue-400'>{pregunta.level}:</strong> {pregunta.question}
                                        </label>
                                        
                                        {hasAttempt && attemptAnswer ? (
                                            // VISTA DE FEEDBACK (intento existente)
                                            <div>
                                                <div className="mb-4 bg-gray-700 p-3 rounded-md border border-gray-600">
                                                    <p className="text-gray-300 font-medium">Tu respuesta:</p>
                                                    <p className="text-white whitespace-pre-wrap mt-1">{attemptAnswer.userAnswer}</p>
                                                </div>
                                                <div className="bg-gray-800 p-4 rounded-md border border-yellow-500/30">
                                                    <h5 className="font-bold text-yellow-400">Evaluación:</h5>
                                                    <p className="text-yellow-200 mt-2"><strong>Puntuación:</strong> <span className="font-bold text-xl">{attemptAnswer.score} / 5</span></p>
                                                    <p className="text-gray-300 mt-1"><strong>Feedback:</strong> {attemptAnswer.feedback}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            // VISTA DE FORMULARIO (sin intento)
                                            <textarea
                                                className="w-full bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500"
                                                rows="4"
                                                placeholder="Escribe tu respuesta aquí..."
                                                value={userAnswers[pregunta._id] || ''}
                                                onChange={(e) => handleAnswerChange(pregunta._id, e.target.value)}
                                                disabled={isSubmitting}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                            {!hasAttempt && (
                                <button
                                    onClick={handleSubmitAnswers}
                                    disabled={isSubmitting}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-4 rounded-lg text-lg transition-transform transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Evaluando...' : 'Evaluar mis Respuestas'}
                                </button>
                            )}
                        </div>
                    ) : <p className="text-center text-gray-500">No hay preguntas generadas.</p>}
                </div>
            </div>
        );
    };

    return (
        <DashboardLayout navLinks={studentNavLinks}>
             <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Detalle de la Evaluación</h1>
                    <p className="text-gray-400 mt-1">Revisa el análisis y responde las preguntas, o consulta tu resultado.</p>
                </div>
                <Link to="/student/evaluations" className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">
                    &larr; Volver
                </Link>
            </div>
            {renderContent()}
        </DashboardLayout>
    );
};

export default EvaluationDetail;
