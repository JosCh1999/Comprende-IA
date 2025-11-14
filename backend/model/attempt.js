
const { model, Schema } = require("mongoose");

// Este sub-esquema define la estructura de una única respuesta dentro de un intento.
const answerSchema = new Schema({
    preguntaId: {
        type: Schema.Types.ObjectId,
        ref: 'Pregunta',
        required: true
    },
    // Denormalizamos el texto de la pregunta para un acceso y visualización más fáciles en el futuro.
    questionText: {
        type: String,
        required: true
    },
    userAnswer: {
        type: String,
        required: true
    },
    // La puntuación para esta respuesta individual, asignada por la IA.
    score: {
        type: Number,
        required: true
    },
    // La retroalimentación textual para esta respuesta, generada por la IA.
    feedback: {
        type: String
    }
}, { _id: false });

const attemptSchema = new Schema({
    // Referencia al usuario que realiza el intento.
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
        index: true
    },
    // Referencia al texto original.
    textId: {
        type: Schema.Types.ObjectId,
        ref: 'Text',
        required: true
    },
    // Array que contiene todas las respuestas evaluadas de este intento.
    answers: [answerSchema],
    // Calificación final del intento, calculada a partir de las puntuaciones individuales.
    totalScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100 // Puntuación final escalada a 100.
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('Attempt', attemptSchema);
