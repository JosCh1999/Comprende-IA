
const Text = require('../model/text');
const { analyzeTextWithAI } = require('./aiService.js');

const createText = async (filename, content, userId) => {
    if (!filename || !content || !userId) {
        throw new Error('Faltan datos obligatorios: filename, content o userId.');
    }

    // --- INICIO: VALIDACIÓN DE DUPLICADOS ---
    // Buscamos si ya existe un texto con el mismo contenido y del mismo propietario.
    const existingText = await Text.findOne({ content: content, owner: userId });

    // Si el texto ya existe, lanzamos un error específico que el controlador pueda identificar.
    if (existingText) {
        const error = new Error('Este texto ya ha sido analizado previamente.');
        error.statusCode = 409; // 409 Conflict: Indica un conflicto con el estado actual del recurso.
        throw error;
    }
    // --- FIN: VALIDACIÓN DE DUPLICADOS ---

    let analysisResult = null;
    try {
        console.log('Iniciando análisis unificado con IA...');
        analysisResult = await analyzeTextWithAI(content);
        console.log('Análisis con IA completado exitosamente.');

    } catch (aiError) {
        console.error("Error durante el análisis con IA en textService:", aiError.message);
        analysisResult = null; 
    }

    const newText = new Text({
        filename,
        content,
        owner: userId,
        analysis: analysisResult, 
    });

    try {
        const savedText = await newText.save();
        return savedText;
    } catch (dbError) {
        console.error("Error en textService al guardar en la BD:", dbError);
        throw new Error('Error al guardar el texto en la base de datos.');
    }
};


const getAllTextsByOwner = async (userId) => {
    if (!userId) {
        throw new Error('El ID de usuario es obligatorio.');
    }
    try {
        return await Text.find({ owner: userId }).sort({ createdAt: -1 });
    } catch (error) {
        throw new Error('Error al obtener los textos de la base de datos.');
    }
};

const getTextByIdAndOwner = async (textId, userId) => {
    if (!textId || !userId) {
        throw new Error('Tanto el ID del texto como el ID del usuario son obligatorios.');
    }
    try {
        const text = await Text.findOne({ _id: textId, owner: userId });
        if (!text) {
            return null;
        }
        return text;
    } catch (error) {
        console.error("Error al buscar texto por ID en la BD:", error);
        throw new Error('Error en la base de datos al buscar el texto.');
    }
};

module.exports = {
    createText,
    getAllTextsByOwner,
    getTextByIdAndOwner,
};
