import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import * as teacherService from '../../services/teacherService';

// --- Iconos SVG ---
const TeacherDashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

const TeacherDashboard = () => {
    const teacherNavLinks = [
        { name: 'Mis Estudiantes', path: '/teacher/students', icon: <TeacherDashboardIcon /> },
        { name: 'Configuración', path: '/teacher/settings', icon: <SettingsIcon /> },
    ];

    const [stats, setStats] = useState({ totalStudents: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await teacherService.getEnrolledStudents();
            setStats({ totalStudents: response.students?.length || 0 });
        } catch (err) {
            console.error('Error al cargar estadísticas:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout navLinks={teacherNavLinks}>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Panel de Profesor</h1>
                <p className="text-gray-400 mt-1">Bienvenido a tu panel de control.</p>
            </div>

            {/* Estadísticas Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-lg shadow-lg">
                    <h3 className="text-white text-sm font-medium mb-2">Estudiantes Enrolados</h3>
                    <p className="text-5xl font-bold text-white">
                        {loading ? '...' : stats.totalStudents}
                    </p>
                </div>
                <Link
                    to="/teacher/students"
                    className="bg-gradient-to-br from-green-600 to-green-800 p-8 rounded-lg shadow-lg hover:from-green-700 hover:to-green-900 transition-all transform hover:scale-105"
                >
                    <h3 className="text-white text-sm font-medium mb-2">Gestionar Estudiantes</h3>
                    <p className="text-white text-lg">Ver lista completa →</p>
                </Link>
            </div>

            {/* Acciones Rápidas */}
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-6">Acciones Rápidas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                        to="/teacher/students"
                        className="bg-gray-700 hover:bg-gray-600 p-6 rounded-lg text-white font-semibold transition-colors"
                    >
                        📚 Ver Mis Estudiantes
                    </Link>
                    <div className="bg-gray-700 p-6 rounded-lg text-gray-400">
                        📊 Reportes (Próximamente)
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default TeacherDashboard;
