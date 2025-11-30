
const { Parser } = require('json2csv');
const Text = require('../model/text');
const Pregunta = require('../model/pregunta');
// Actualizado para usar el nuevo servicio de IA
const { generateQuestions: generateQuestionsService, detectFallacies: detectFallaciesService } = require('../services/aiService.js');

const generateQuestions = async (req, res) => {
    try {
        const { textId } = req.params;
        const textDocument = await Text.findById(textId);

        if (!textDocument) {
            return res.status(404).json({ message: "Texto no encontrado." });
        }
        
        const existingQuestions = await Pregunta.find({ textId });
        if (existingQuestions.length > 0) {
            return res.status(200).json({
                message: "Las preguntas para este texto ya han sido generadas.",
                questions: existingQuestions
            });
        }

        // Llamada al nuevo servicio de IA
        const generatedData = await generateQuestionsService(textDocument.content);

        const preguntasParaGuardar = generatedData.questions.map(q => ({
            textId: textId,
            level: q.level,
            question: q.question,
        }));

        const savedQuestions = await Pregunta.insertMany(preguntasParaGuardar);
        
        res.status(201).json({
            message: "Preguntas generadas y guardadas exitosamente.",
            questions: savedQuestions
        });

    } catch (error) {
        console.error("Error en el controlador al generar preguntas:", error);
        res.status(500).json({ 
            message: "Error interno del servidor al generar preguntas.",
            error: error.message 
        });
    }
};

const detectFallacies = async (req, res) => {
    try {
        const { textId } = req.params;
        const textDocument = await Text.findById(textId);

        if (!textDocument) {
            return res.status(404).json({ message: "Texto no encontrado." });
        }

        if (textDocument.analysis) {
            return res.status(200).json({
                message: "El análisis de falacias para este texto ya existe.",
                analysis: textDocument.analysis
            });
        }

        // Llamada al nuevo servicio de IA
        const generatedAnalysis = await detectFallaciesService(textDocument.content);

        textDocument.analysis = generatedAnalysis.analysis;
        const updatedText = await textDocument.save();

        res.status(201).json({
            message: "Análisis de falacias generado y guardado exitosamente.",
            analysis: updatedText.analysis
        });

    } catch (error) {
        console.error("Error en el controlador al detectar falacias:", error);
        res.status(500).json({ 
            message: "Error interno del servidor al detectar falacias.",
            error: error.message 
        });
    }
};

const exportQuestionsToCsv = async (req, res) => {
    try {
        const { textId } = req.params;
        const questionsInDb = await Pregunta.find({ textId }).lean();

        if (!questionsInDb || questionsInDb.length === 0) {
            return res.status(404).json({ message: "No se encontraron preguntas para este texto. Genérelas primero." });
        }

        const fields = ['level', 'question'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(questionsInDb);

        res.header('Content-Type', 'text/csv');
        res.attachment(`preguntas-${textId}.csv`);
        res.send(csv);

    } catch (error) {
        console.error("Error al exportar preguntas a CSV:", error);
        res.status(500).json({ 
            message: "Error interno del servidor al exportar las preguntas.",
            error: error.message 
        });
    }
};

module.exports = {
    generateQuestions,
    detectFallacies,
    exportQuestionsToCsv
};