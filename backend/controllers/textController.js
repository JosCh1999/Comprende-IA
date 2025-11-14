
const textService = require('../services/textService.js');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const uploadText = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No se ha subido ningún archivo.' });

        const { buffer, mimetype, originalname } = req.file;
        let content = '';

        if (mimetype === 'application/pdf') {
            const data = await pdfParse(buffer);
            content = data.text;
        } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const { value } = await mammoth.extractRawText({ buffer });
            content = value;
        } else if (mimetype === 'text/plain') {
            content = buffer.toString('utf-8');
        }

        if (!content.trim()) {
            return res.status(400).json({ message: 'El archivo está vacío o no se pudo leer el contenido.' });
        }

        const newText = await textService.createText(originalname, content, req.userId);
        res.status(201).json({ message: "Archivo procesado exitosamente.", text: newText });

    } catch (error) {
        // Si el servicio lanza el error de duplicado (409), lo pasamos al cliente.
        if (error.statusCode === 409) {
            return res.status(409).json({ message: error.message });
        }
        // Para cualquier otro error, respondemos con un error 500 genérico.
        console.error("Error en uploadText controller:", error);
        res.status(500).json({ message: "Error interno del servidor al procesar el archivo." });
    }
};

const createText = async (req, res) => {
    try {
        const { filename, content } = req.body;
        const newText = await textService.createText(filename, content, req.userId);
        res.status(201).json({ message: "Texto creado exitosamente", text: newText });
    } catch (error) {
        // Manejo específico para el error de duplicado.
        if (error.statusCode === 409) {
            return res.status(409).json({ message: error.message });
        }
        // Manejo para errores de validación (datos faltantes).
        if (error.message.startsWith('Faltan datos')) {
            return res.status(400).json({ message: error.message });
        }
        // Error genérico para otros casos.
        console.error("Error en createText controller:", error);
        res.status(500).json({ message: error.message });
    }
};

const getAllTexts = async (req, res) => {
    try {
        const userTexts = await textService.getAllTextsByOwner(req.userId);
        res.status(200).json({
            message: "Textos del usuario obtenidos exitosamente",
            texts: userTexts
        });
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor al obtener los textos." });
    }
};

const getTextById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const text = await textService.getTextByIdAndOwner(id, userId);
        if (!text) {
            return res.status(404).json({ message: 'Texto no encontrado o no tienes permiso para verlo.' });
        }
        res.status(200).json({
            message: "Texto obtenido exitosamente",
            text: text
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'El ID del texto no es válido.' });
        }
        res.status(500).json({ message: "Error interno del servidor al obtener el texto." });
    }
};

module.exports = {
    uploadText,
    createText,
    getAllTexts,
    getTextById,
};