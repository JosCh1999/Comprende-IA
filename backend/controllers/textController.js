const Text = require('../model/text');

const uploadText = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No se ha subido ningún archivo." });
    }

    if (req.file.mimetype !== 'text/plain') {
        return res.status(400).json({ message: "Solo se admiten archivos .txt" });
    }

    try {
        const content = req.file.buffer.toString('utf-8');

        const newText = new Text({
            filename: req.file.originalname,
            content: content
        });

        await newText.save();

        res.status(201).json({ 
            message: "¡Archivo subido y procesado con éxito!",
            textId: newText._id
        });

    } catch (error) {
        console.error("Error al guardar el texto:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};

const saveText = async (req, res) => {
    const { text } = req.body;

    if (!text || typeof text !== 'string' || text.trim() === '') {
        return res.status(400).json({ message: "El texto no puede estar vacío." });
    }

    try {
        const newText = new Text({
            filename: `texto-${Date.now()}.txt`,
            content: text
        });

        await newText.save();

        res.status(201).json({
            message: "Texto guardado con éxito!",
            textId: newText._id
        });

    } catch (error) {
        console.error("Error al guardar el texto:", error);
        res.status(500).json({ message: "Error interno del servidor al guardar el texto." });
    }
};

module.exports = { uploadText, saveText };
