
const { model, Schema } = require("mongoose");

const preguntaSchema = new Schema({
    // Referencia al texto original al que pertenece esta pregunta.
    textId: {
        type: Schema.Types.ObjectId,
        ref: 'Text',
        required: true
    },
    // Nivel de la pregunta (Literal, Inferencial, Crítico).
    level: {
        type: String,
        required: true,
        enum: ['Literal', 'Inferencial', 'Crítico']
    },
    // El texto de la pregunta.
    question: {
        type: String,
        required: true
    },
    // Opcional: podrías añadir campos para opciones y respuesta correcta más adelante.
    // options: [String],
    // correctAnswer: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('Pregunta', preguntaSchema);