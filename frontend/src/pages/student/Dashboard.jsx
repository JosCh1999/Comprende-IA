
import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';

// --- Iconos para la Navegación (re-definidos para autocontención) ---
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const EvaluationsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-4.586a1 1 0 01.293-.707l5.414-5.414a1 1 0 01.707-.293h4.586"/></svg>;
const ProgressIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;


const StudentDashboard = () => {

    const studentNavLinks = [
        { name: 'Subir Archivo', path: '/student/upload', icon: <UploadIcon /> },
        { name: 'Evaluaciones', path: '/student/evaluations', icon: <EvaluationsIcon /> },
        { name: 'Progreso', path: '/student/progress', icon: <ProgressIcon /> },
    ];

    return (
        <DashboardLayout navLinks={studentNavLinks}>
            {/* Header de la página */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Dashboard Principal</h1>
                <p className="text-gray-400 mt-1">Bienvenido a tu centro de control de aprendizaje.</p>
            </div>

            {/* Tarjeta de Contenido Principal */}
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-white mb-4">Comienza tu Análisis</h2>
                <p className="text-gray-300 mb-6">
                    Utiliza el menú de la izquierda para navegar por las diferentes secciones:
                </p>
                <ul className="list-disc list-inside space-y-4 text-gray-300">
                    <li>
                        <span className="font-semibold text-white">Subir Archivo:</span> Carga un nuevo texto en formato PDF, DOCX o TXT para que la IA genere preguntas de comprensión.
                    </li>
                    <li>
                        <span className="font-semibold text-white">Evaluaciones:</span> Responde a las preguntas generadas, recibe una calificación y un feedback detallado para mejorar.
                    </li>
                    <li>
                        <span className="font-semibold text-white">Progreso:</span> Visualiza tu historial de calificaciones y sigue tu evolución a lo largo del tiempo.
                    </li>
                </ul>
            </div>
        </DashboardLayout>
    );
};

export default StudentDashboard;