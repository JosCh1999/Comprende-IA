const Text = require('../model/text');
const { generateQuestionsFlow, detectFallaciesFlow } = require('../flow');

const generateQuestions = async (req, res) => {
  try {
    const { textId } = req.params;
    const textDocument = await Text.findById(textId);

    if (!textDocument) {
      return res.status(404).json({ message: "Texto no encontrado." });
    }

    const result = await generateQuestionsFlow(textDocument.content);
    res.json(result);

  } catch (error) {
    console.error("Error al ejecutar el flow de generar preguntas:", error);
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

    const result = await detectFallaciesFlow(textDocument.content);
    res.json(result);

  } catch (error) {
    console.error("Error al ejecutar el flow de detectar falacias:", error);
    res.status(500).json({ 
      message: "Error interno del servidor al detectar falacias.",
      error: error.message 
    });
  }
};

module.exports = {
  generateQuestions,
  detectFallacies
};