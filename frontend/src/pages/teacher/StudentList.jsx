import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import * as teacherService from '../../services/teacherService';

// --- Iconos SVG ---
const TeacherDashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>;

const StudentList = () => {
    const teacherNavLinks = [
        { name: 'Mis Estudiantes', path: '/teacher/students', icon: <TeacherDashboardIcon /> },
        { name: 'Configuración', path: '/teacher/settings', icon: <SettingsIcon /> },
    ];

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [enrollEmail, setEnrollEmail] = useState('');
    const [enrolling, setEnrolling] = useState(false);
    const [enrollError, setEnrollError] = useState(null);

    // Cargar estudiantes al montar el componente
    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await teacherService.getEnrolledStudents();
            setStudents(response.students || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEnrollStudent = async (e) => {
        e.preventDefault();
        setEnrolling(true);
        setEnrollError(null);

        try {
            await teacherService.enrollStudent(enrollEmail);
            // Recargar lista de estudiantes
            await fetchStudents();
            // Cerrar modal y limpiar
            setShowEnrollModal(false);
            setEnrollEmail('');
        } catch (err) {
            setEnrollError(err.message);
        } finally {
            setEnrolling(false);
        }
    };

    const renderContent = () => {
        if (loading) {
            return <p className="text-center text-gray-400">Cargando estudiantes...</p>;
        }

        if (error) {
            return (
                <div className="bg-red-900/50 border border-red-500 text-white p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-2">Error</h3>
                    <p>{error}</p>
                </div>
            );
        }

        if (students.length === 0) {
            return (
                <div className="bg-gray-800 p-12 rounded-lg text-center">
                    <h3 className="text-xl font-semibold text-white mb-2">No tienes estudiantes enrolados</h3>
                    <p className="text-gray-400 mb-6">Comienza agregando estudiantes a tu clase usando su email.</p>
                    <button
                        onClick={() => setShowEnrollModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg inline-flex items-center"
                    >
                        <PlusIcon />
                        <span className="ml-2">Agregar Estudiante</span>
                    </button>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {students.map((student) => (
                    <div
                        key={student.studentId}
                        className="bg-gray-800 p-6 rounded-lg shadow-md flex justify-between items-center hover:bg-gray-750 transition-colors"
                    >
                        <div>
                            <h3 className="text-lg font-semibold text-white">{student.nombre}</h3>
                            <p className="text-gray-400 text-sm">{student.correo}</p>
                            <p className="text-gray-500 text-xs mt-1">
                                Enrolado: {new Date(student.enrolledAt).toLocaleDateString('es-ES')}
                            </p>
                        </div>
                        <Link
                            to={`/teacher/students/${student.studentId}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                        >
                            Ver Progreso
                        </Link>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <DashboardLayout navLinks={teacherNavLinks}>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Mis Estudiantes</h1>
                    <p className="text-gray-400 mt-1">
                        Gestiona y monitorea el progreso de tus estudiantes.
                    </p>
                </div>
                {students.length > 0 && (
                    <button
                        onClick={() => setShowEnrollModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center"
                    >
                        <PlusIcon />
                        <span className="ml-2">Agregar Estudiante</span>
                    </button>
                )}
            </div>

            {/* Contenido */}
            {renderContent()}

            {/* Modal de Enrolamiento */}
            {showEnrollModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
                        <h2 className="text-2xl font-bold text-white mb-4">Agregar Estudiante</h2>
                        <form onSubmit={handleEnrollStudent}>
                            <div className="mb-4">
                                <label className="block text-gray-300 mb-2">Email del Estudiante</label>
                                <input
                                    type="email"
                                    value={enrollEmail}
                                    onChange={(e) => setEnrollEmail(e.target.value)}
                                    className="w-full bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="estudiante@example.com"
                                    required
                                    disabled={enrolling}
                                />
                            </div>

                            {enrollError && (
                                <div className="mb-4 bg-red-900/50 border border-red-500 text-white p-3 rounded-md text-sm">
                                    {enrollError}
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEnrollModal(false);
                                        setEnrollEmail('');
                                        setEnrollError(null);
                                    }}
                                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
                                    disabled={enrolling}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed"
                                    disabled={enrolling}
                                >
                                    {enrolling ? 'Agregando...' : 'Agregar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default StudentList;
