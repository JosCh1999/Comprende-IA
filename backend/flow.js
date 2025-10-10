const { GoogleGenerativeAI } = require("@google/generative-ai");
const { z } = require('zod');

// Inicializar la API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Esquemas de validación
const QuestionSchema = z.object({
  questions: z.array(z.object({ 
    level: z.string(), 
    question: z.string() 
  }))
});

const FallacySchema = z.object({
  analysis: z.array(z.object({ 
    type: z.string(), 
    fragment: z.string() 
  }))
});

// Función para llamar a Gemini con la librería oficial
async function callGeminiAPI(prompt, schema) {
  try {
    console.log('Llamando a Gemini API...');

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2000,
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const resultText = response.text();
    
    console.log('✅ Respuesta de Gemini recibida');
    console.log('Texto recibido:', resultText.substring(0, 100) + '...');
    
    // Limpiar el texto (quitar markdown si existe)
    const cleanText = resultText.replace(/```json\n?|\n?```/g, '').trim();
    
    // Parsear y validar
    const parsed = JSON.parse(cleanText);
    return schema.parse(parsed);
    
  } catch (error) {
    console.error('ERROR en callGeminiAPI:');
    console.error('- Mensaje:', error.message);
    
    // Mejor manejo de errores de JSON
    if (error instanceof SyntaxError) {
      throw new Error('La respuesta de Gemini no es JSON válido: ' + error.message);
    }
    
    throw new Error(`Error de Gemini: ${error.message}`);
  }
}

// Flow para generar preguntas
const generateQuestionsFlow = async (text) => {
  const prompt = `
    Basado en el siguiente texto, genera exactamente 5 preguntas de comprensión lectora.
    Clasifica cada pregunta según su nivel: "Literal", "Inferencial" o "Crítico".
    Responde únicamente con un objeto JSON válido, sin añadir texto antes o después.
    La estructura del JSON debe ser:
    {
      "questions": [
        { "level": "Nivel", "question": "Pregunta 1" },
        { "level": "Nivel", "question": "Pregunta 2" },
        { "level": "Nivel", "question": "Pregunta 3" },
        { "level": "Nivel", "question": "Pregunta 4" },
        { "level": "Nivel", "question": "Pregunta 5" }
      ]
    }

    Texto:
    ${text}
  `;

  return await callGeminiAPI(prompt, QuestionSchema);
};

// Flow para detectar falacias
const detectFallaciesFlow = async (text) => {
  const prompt = `
    Analiza el siguiente texto en busca de falacias lógicas y sesgos cognitivos.
    Identifica el tipo de falacia o sesgo y extrae el fragmento exacto del texto donde ocurre.
    Responde únicamente con un objeto JSON válido, sin añadir texto antes o después.
    La estructura del JSON debe ser:
    {
      "analysis": [
        { "type": "Tipo de Falacia/Sesgo", "fragment": "El fragmento exacto del texto donde se encuentra la falacia." }
      ]
    }
    Si no encuentras falacias o sesgos, devuelve un array "analysis" vacío.

    Texto:
    ${text}
  `;

  return await callGeminiAPI(prompt, FallacySchema);
};

module.exports = { 
  generateQuestionsFlow, 
  detectFallaciesFlow 
};