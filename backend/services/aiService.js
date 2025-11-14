
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) {
  throw new Error("La variable de entorno GOOGLE_API_KEY no se encuentra. Revisa tu archivo .env");
}
const genAI = new GoogleGenerativeAI(API_KEY);

async function callGeminiForJson(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", generationConfig: { responseMimeType: "application/json", temperature: 0.35 } });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error al llamar a la API de Gemini o al parsear JSON:", error);
    throw new Error("No se pudo obtener una respuesta JSON válida de la IA.");
  }
}

// --- FUNCIÓN ÚNICA CON PROMPT DE CALIDAD EXPERTA ---
const analyzeTextWithAI = async (text) => {
    const analysisPrompt = `
Tu rol es actuar como un experto en lógica y pensamiento crítico. Tu tarea es realizar un análisis exhaustivo de un texto.

Tu respuesta DEBE SER EXCLUSIVAMENTE un objeto JSON válido, sin comentarios, texto introductorio, o marcadores de código como \`\`\`json.

El objeto JSON DEBE CONTENER OBLIGATORIAMENTE las siguientes tres claves: "resumen", "falacias", y "preguntas".

ESTRUCTURA Y REGLAS DETALLADAS:

1.  **"resumen"**: (String) Un resumen conciso, objetivo y neutral del contenido principal del texto. ESTA CLAVE NUNCA PUEDE ESTAR VACÍA.

2.  **"falacias"**: (Array de Objetos) Identifica las falacias lógicas en el texto.
    *   Cada objeto en el array debe tener "tipo" (String) y "descripcion" (String).
    *   En "descripcion", explica CLARAMENTE por qué es una falacia y CITA la parte específica del texto.
    *   **¡ACCIÓN CRÍTICA E INDISPENSABLE! Tu tarea principal y de mayor valor es identificar las falacias lógicas. Debes esforzarte al máximo por encontrar al menos una, incluso si es sutil. Solo en el caso extremadamente raro de que un texto sea puramente descriptivo y sin argumentación alguna, podrías devolver un array vacío.**


3.  **"preguntas"**: (Array de 3 Objetos) Genera exactamente tres preguntas de evaluación basadas en el texto.
    *   Cada objeto debe tener "level" y "question".
    *   Los niveles deben ser: "Literal" (la respuesta está explícita), "Inferencial" (la respuesta se deduce), y "Crítico" (requiere opinar o evaluar el argumento del texto).

EJEMPLO DE RESPUESTA PARA UN TEXTO CON FALACIAS:
{
  "resumen": "El autor argumenta en contra de la nueva ley de zonificación, sugiriendo que solo beneficiará a los políticos y que la oposición está mal informada.",
  "falacias": [
    {
      "tipo": "Ad Hominem",
      "descripcion": "El autor ataca a los que apoyan la ley en lugar de sus argumentos, diciendo: 'No podemos hacer caso a un grupo de burócratas que nunca han trabajado un día en el sector privado'."
    },
    {
      "tipo": "Generalización Apresurada",
      "descripcion": "Se basa en una sola queja de un vecino para afirmar que 'toda la comunidad está en contra del proyecto', lo cual es una conclusión basada en evidencia insuficiente."
    }
  ],
  "preguntas": [
    { "level": "Literal", "question": "¿Cuál es la principal propuesta del autor sobre la ley de zonificación?" },
    { "level": "Inferencial", "question": "¿Qué se puede inferir sobre la situación económica del autor a partir de sus argumentos?" },
    { "level": "Crítico", "question": "¿Consideras que los ejemplos que da el autor son suficientes para justificar su rechazo total a la ley? ¿Por qué?" }
  ]
}

Ahora, aplica este análisis riguroso al siguiente texto:
Texto: \'\'\'
${text}
\'\'\'
    `;
    return await callGeminiForJson(analysisPrompt);
};


const evaluateAnswer = async (questionText, userAnswer) => {
    const evaluationPrompt = `
        Evalúa la respuesta de un usuario a una pregunta específica, en español.
        Responde EXCLUSIVAMENTE con un objeto JSON con "score" (1-5) y "feedback" (string).

        Pregunta: \\"${questionText}\\"
        Respuesta del usuario: \\"${userAnswer}\\"
    `;
    return await callGeminiForJson(evaluationPrompt);
};

module.exports = {
    analyzeTextWithAI,
    evaluateAnswer
};




