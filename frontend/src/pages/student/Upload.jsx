
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';

const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const EvaluationsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-4.586a1 1 0 01.293-.707l5.414-5.414a1 1 0 01.707-.293h4.586" /></svg>;
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
    const [uploadProgress, setUploadProgress] = useState(0);
    const navigate = useNavigate();

    // Constante para el límite de tamaño (10 MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB en bytes
    const MAX_FILE_SIZE_MB = 10;

    // Función para formatear el tamaño del archivo
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        // Validar tamaño del archivo
        if (selectedFile.size > MAX_FILE_SIZE) {
            setError(`❌ El archivo es demasiado grande (${formatFileSize(selectedFile.size)}). El tamaño máximo permitido es ${MAX_FILE_SIZE_MB} MB.`);
            setFile(null);
            setMessage('');
            e.target.value = ''; // Limpiar el input
            return;
        }

        // Validar tipo de archivo
        const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
        if (!allowedTypes.includes(selectedFile.type)) {
            setError('❌ Formato de archivo no válido. Solo se permiten archivos PDF, DOCX o TXT.');
            setFile(null);
            setMessage('');
            e.target.value = '';
            return;
        }

        setFile(selectedFile);
        setMessage(`✅ Archivo seleccionado: ${selectedFile.name} (${formatFileSize(selectedFile.size)})`);
        setError('');
        setUploadProgress(0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Por favor, selecciona un archivo para subir.');
            return;
        }

        setIsProcessing(true);
        setError('');
        setMessage('📤 Subiendo y analizando el archivo... Esto puede tardar un momento, por favor, espera.');
        setUploadProgress(10);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            setUploadProgress(30);

            const response = await fetch('http://localhost:4000/textos/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });

            setUploadProgress(70);
            const data = await response.json();

            if (!response.ok) {
                // Mensajes de error más descriptivos según el código de estado
                let errorMessage = data.message || 'Ocurrió un error inesperado.';

                if (response.status === 400) {
                    if (data.message.includes('vacío')) {
                        errorMessage = '❌ El archivo está vacío o no contiene texto legible. Por favor, verifica el contenido del archivo.';
                    } else if (data.message.includes('leer')) {
                        errorMessage = '❌ No se pudo leer el archivo. Puede estar corrupto o en un formato incompatible. Intenta con otro archivo.';
                    } else {
                        errorMessage = '❌ ' + errorMessage;
                    }
                } else if (response.status === 413) {
                    errorMessage = `❌ El archivo es demasiado grande. El tamaño máximo permitido es ${MAX_FILE_SIZE_MB} MB.`;
                } else if (response.status === 500) {
                    errorMessage = '❌ Error del servidor al procesar el archivo. Puede que el archivo esté corrupto. Intenta con otro archivo o inténtalo más tarde.';
                }

                const customError = new Error(errorMessage);
                customError.status = response.status;
                throw customError;
            }

            setUploadProgress(100);
            setMessage('✅ ¡Análisis completado con éxito! Redirigiendo a los detalles de la evaluación...');

            setTimeout(() => {
                navigate(`/student/evaluations/${data.text._id}`);
            }, 2000);

        } catch (err) {
            setUploadProgress(0);

            // Manejo de errores mejorado
            if (err.status === 409) {
                setError('⚠️ ' + err.message + " Puedes revisar el análisis previo en la sección de Evaluaciones.");
            } else if (err.name === 'TypeError' && err.message.includes('fetch')) {
                setError('❌ No se pudo conectar con el servidor. Verifica tu conexión a internet e inténtalo de nuevo.');
            } else {
                setError(err.message || "❌ Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.");
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
                        <label htmlFor="file-upload" className="block text-lg font-medium text-gray-300 mb-2">
                            Selecciona un archivo
                        </label>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-gray-400">
                                Formatos soportados: <span className="font-semibold text-blue-400">.pdf, .docx, .txt</span>
                            </p>
                            <p className="text-sm text-gray-400">
                                Tamaño máximo: <span className="font-semibold text-blue-400">{MAX_FILE_SIZE_MB} MB</span>
                            </p>
                        </div>
                        <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 disabled:opacity-50 cursor-pointer"
                            accept=".pdf,.docx,.txt"
                            disabled={isProcessing}
                        />

                        {/* Información del archivo seleccionado */}
                        {file && !error && (
                            <div className="mt-3 p-3 bg-gray-700 rounded-md border border-gray-600">
                                <p className="text-sm text-gray-300">
                                    📄 <span className="font-semibold">{file.name}</span>
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Tamaño: {formatFileSize(file.size)}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Barra de progreso */}
                    {isProcessing && uploadProgress > 0 && (
                        <div className="mb-6">
                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-400 mt-1 text-center">{uploadProgress}%</p>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                            disabled={isProcessing || !file}
                        >
                            {isProcessing ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Procesando...
                                </span>
                            ) : (
                                'Subir y Analizar'
                            )}
                        </button>
                    </div>
                </form>

                {/* Mensajes de estado y error con mejor visibilidad */}
                {message && !error && (
                    <div className="mt-6 p-4 bg-blue-900/30 border border-blue-500 rounded-md">
                        <p className="text-center text-blue-300 font-semibold">{message}</p>
                    </div>
                )}
                {error && (
                    <div className="mt-6 p-4 bg-red-900/30 border border-red-500 rounded-md">
                        <p className="text-center text-red-300 font-semibold">{error}</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Upload;