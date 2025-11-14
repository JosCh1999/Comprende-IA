
import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';

// --- Iconos para la Navegación ---
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const EvaluationsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-4.586a1 1 0 01.293-.707l5.414-5.414a1 1 0 01.707-.293h4.586"/></svg>;
const ProgressIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;

const Progress = () => {
    const studentNavLinks = [
        { name: 'Subir Archivo', path: '/student/upload', icon: <UploadIcon /> },
        { name: 'Evaluaciones', path: '/student/evaluations', icon: <EvaluationsIcon /> },
        { name: 'Progreso', path: '/student/progress', icon: <ProgressIcon /> },
    ];

    return (
        <DashboardLayout navLinks={studentNavLinks}>
            {/* Header de la página */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Mi Progreso</h1>
                <p className="text-gray-400 mt-1">Visualiza tu rendimiento y evolución a lo largo del tiempo.</p>
            </div>

            {/* Contenido de la página (Placeholder) */}
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
                <h2 className="text-xl font-semibold text-white">Próximamente</h2>
                <p className="text-gray-400 mt-2">Aquí encontrarás gráficos con tu historial de notas, estadísticas sobre los textos completados y recomendaciones personalizadas.</p>
            </div>
        </DashboardLayout>
    );
};

export default Progress;