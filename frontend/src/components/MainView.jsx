import React, { useState } from 'react';
import axios from 'axios';
import styles from './MainView.module.scss'; // Usamos el nuevo módulo de estilos

const MainView = ({ user }) => {
    const [text, setText] = useState('');
    const [analysisType, setAnalysisType] = useState(null);
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAnalysis = async (type) => {
        if (!text.trim()) {
            setError('Por favor, ingresa texto para analizar.');
            return;
        }

        setAnalysisType(type);
        setIsLoading(true);
        setError('');
        setResults(null);

        try {
            const saveRes = await axios.post('http://localhost:4000/api/save-text', { text });
            const { textId } = saveRes.data;

            const endpoint = `http://localhost:4000/api/analyze/${textId}/${type}`;
            const analysisRes = await axios.get(endpoint);

            setResults(analysisRes.data.analysis || analysisRes.data.questions || []);
        } catch (err) {
            console.error(`Error al analizar ${type}:`, err);
            setError('Hubo un error al comunicarse con la IA. Asegúrate de que tu API Key de Gemini es correcta y que el servidor backend está funcionando.');
        } finally {
            setIsLoading(false);
        }
    };

    const getInitialMessage = () => (
        <div className={styles.initialMessage}>
            <p>Los resultados del análisis aparecerán aquí.</p>
            <span>Ingresa texto y selecciona un tipo de análisis para comenzar.</span>
        </div>
    );

    const renderResults = () => {
        if (isLoading) {
            return <div className={styles.loading}>Analizando... Por favor, espera.</div>;
        }
        if (error) {
            return <div className={styles.error}>{error}</div>;
        }
        if (!results) {
            return getInitialMessage();
        }
        if (results.length === 0) {
            return <p>No se encontraron resultados para este análisis.</p>;
        }

        if (analysisType === 'questions') {
            return (
                <div className={styles.analysisSection}>
                    <h2>Preguntas de Comprensión</h2>
                    <ul>
                        {results.map((q, i) => (
                            <li key={i}>
                                <strong>{`[${q.level}]`}</strong> {q.question}
                            </li>
                        ))}
                    </ul>
                </div>
            );
        }

        if (analysisType === 'fallacies') {
            return (
                <div className={styles.analysisSection}>
                    <h2>Análisis de Falacias y Sesgos</h2>
                    <ul>
                        {results.map((f, i) => (
                            <li key={i}>
                                <strong>{f.type}:</strong> "{f.fragment}"
                            </li>
                        ))}
                    </ul>
                </div>
            );
        }
        return getInitialMessage();
    };

    return (
        <div className={styles.mainContainer}>
            <header className={styles.header}>
                <h1>Bienvenido a Comprende-IA, {user.nombre}</h1>
                <p>Tu asistente inteligente para la lectura crítica.</p>
            </header>
            <div className={styles.content}>
                <div className={styles.textInput}>
                    <h2>Tu Texto</h2>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Pega aquí el artículo, ensayo o texto que deseas analizar..."
                    />
                    <div className={styles.buttons}>
                        <button onClick={() => handleAnalysis('questions')} disabled={isLoading} className={styles.primary}>
                            Generar Preguntas
                        </button>
                        <button onClick={() => handleAnalysis('fallacies')} disabled={isLoading} className={styles.secondary}>
                            Detectar Sesgos y Falacias
                        </button>
                    </div>
                </div>
                <div className={styles.analysisResults}>
                    <h2>Resultados del Análisis</h2>
                    <div className={styles.resultsBox}>
                        {renderResults()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainView;