import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';

// --- Iconos SVG ---
const TeacherDashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 00-4-4H3V9a4 4 0 004-4h2a4 4 0 004 4v2m-6 4h12M9 17l-6-6m6 6l6-6" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const ExportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;

// --- Componentes de la UI ---

const Header = () => (
    <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Teacher Dashboard</h1>
        <p className="text-gray-400 mt-1">Monitor your students' collective progress.</p>
    </div>
);

const CourseOverviewCard = () => (
    <div className="bg-gray-800 p-8 rounded-lg">
        {/* Header de la tarjeta */}
        <div className="flex justify-between items-center mb-8">
            <div>
                <h3 className="text-xl font-semibold text-white">Course Overview</h3>
                <p className="text-gray-400 text-sm">Select a course to view aggregated metrics.</p>
            </div>
            <div className="flex items-center space-x-4">
                <select className="bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:ring-blue-500 focus:border-blue-500">
                    <option>Philosophy 101</option>
                    <option>History of Art</option>
                    <option>Advanced Physics</option>
                </select>
                <button className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                    <ExportIcon />
                    Export Metrics
                </button>
            </div>
        </div>

        {/* Cuerpo de la tarjeta con el gráfico */}
        <div className="flex justify-center items-center h-80 relative">
            {/* Placeholder del gráfico circular (se reemplazará con una librería) */}
            <div className="absolute text-center">
                <p className="text-5xl font-bold text-white">100%</p>
                <p className="text-gray-400">Completed</p>
            </div>
            <svg className="w-full h-full" viewBox="0 0 36 36">
                 <path className="text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                <path className="text-blue-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="100, 100" strokeDashoffset="0" />
            </svg>
        </div>
    </div>
);


// --- Componente Principal de la Página ---

const TeacherDashboard = () => {
    // Definimos los enlaces para el layout
    const teacherNavLinks = [
        { name: 'Teacher Dashboard', path: '/teacher/dashboard', icon: <TeacherDashboardIcon /> },
        { name: 'Settings', path: '/teacher/settings', icon: <SettingsIcon /> },
    ];

    return (
        <DashboardLayout navLinks={teacherNavLinks}>
            <Header />
            <CourseOverviewCard />
        </DashboardLayout>
    );
};

export default TeacherDashboard;
