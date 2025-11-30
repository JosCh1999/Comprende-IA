
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';

const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const EvaluationsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-4.586a1 1 0 01.293-.707l5.414-5.414a1 1 0 01.707-.293h4.586"/></svg>;
const ProgressIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;

const Upload = () => {
    const studentNavLinks = [
        { name: 'Subir Archivo', path: '/student/upload', icon: <UploadIcon /> },
        { name: 'Evaluaciones', path: '/student/evaluations', icon: <EvaluationsIcon /> },
        { name: 'Progreso', path: '/student/progress', icon: <ProgressIcon /> },
    ];

    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setMessage(`Archivo seleccionado: ${selectedFile.name}`);
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Por favor, selecciona un archivo para subir.');
            return;
        }

        setIsProcessing(true);
        setError('');
        setMessage('Subiendo y analizando el archivo... Esto puede tardar un momento, por favor, espera.');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:4000/textos/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                // Creamos un error personalizado que también contenga el status code
                const customError = new Error(data.message || 'Ocurrió un error inesperado.');
                customError.status = response.status;
                throw customError;
            }

            setMessage('¡Análisis completado con éxito! Redirigiendo a los detalles de la evaluación...');
            
            setTimeout(() => {
                navigate(`/student/evaluations/${data.text._id}`);
            }, 2000);

        } catch (err) {
            // Ahora podemos diferenciar el error en el bloque catch
            if (err.status === 409) {
                setError(err.message + " Puedes revisar el análisis previo en la sección de Evaluaciones.");
            } else {
                setError(err.message || "No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.");
            }
            setMessage('');
        } finally {
            setIsProcessing(false); 
        }
    };

    return (
        <DashboardLayout navLinks={studentNavLinks}>
            <h1 className="text-3xl font-bold text-white mb-8">Subir Archivo para Análisis</h1>
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="file-upload" className="block text-lg font-medium text-gray-300 mb-2">Selecciona un archivo</label>
                        <p className="text-sm text-gray-500 mb-4">Formatos soportados: .pdf, .docx, .txt</p>
                        <input 
                            id="file-upload" 
                            name="file-upload" 
                            type="file" 
                            onChange={handleFileChange} 
                            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 disabled:opacity-50"
                            accept=".pdf,.docx,.txt"
                            disabled={isProcessing}
                        />
                    </div>
                    <div>
                        <button 
                            type="submit" 
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
                            disabled={isProcessing || !file}
                        >
                            {isProcessing ? 'Procesando...' : 'Subir y Analizar'}
                        </button>
                    </div>
                </form>
                {/* Mensajes de estado y error con mejor visibilidad */}
                {message && !error && <p className="mt-6 text-center text-blue-300 font-semibold">{message}</p>}
                {error && <p className="mt-6 text-center text-red-400 bg-red-900/50 p-3 rounded-md border border-red-500 font-semibold">{error}</p>}
            </div>
        </DashboardLayout>
    );
};

export default Upload;