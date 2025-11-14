
const { model, Schema } = require("mongoose");

// --- Esquema para las Preguntas (¡LA SOLUCIÓN!) ---
// Al definir un esquema explícito para las preguntas, Mongoose se asegura de que
// cada pregunta en el array tenga su propio `_id` único y autogenerado.
// Esto resuelve el bug en el frontend donde todos los textareas se actualizaban a la vez.
const questionSchema = new Schema({
    level: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    }
    // NOTA: No necesitamos definir `_id` aquí, Mongoose lo añade automáticamente.
});

// --- Esquema para las Falacias (Buena práctica) ---
// Aunque no causaba un bug, definir un esquema para las falacias hace que el modelo sea más robusto
// y predecible.
const fallacySchema = new Schema({
    tipo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    }
});

// --- Esquema para el Análisis Completo ---
// Este esquema anidado reemplaza el `Schema.Types.Mixed` anterior.
// Ahora la estructura de los datos de análisis está claramente definida y validada.
const analysisSchema = new Schema({
    resumen: {
        type: String,
        required: true
    },
    falacias: [fallacySchema], // Un array de documentos de falacias
    preguntas: [questionSchema] // Un array de documentos de preguntas
});

const textSchema = new Schema({
    filename: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    // Reemplazamos el campo `analysis` por nuestro nuevo esquema anidado.
    analysis: {
        type: analysisSchema,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('Text', textSchema);