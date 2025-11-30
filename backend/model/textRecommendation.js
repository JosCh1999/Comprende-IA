const { model, Schema } = require("mongoose");

/**
 * Modelo de TextRecommendation (Recomendación de Texto)
 * Representa un texto que un profesor recomienda a un estudiante específico.
 */
const textRecommendationSchema = new Schema({
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
        index: true
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
        index: true
    },
    text: {
        type: Schema.Types.ObjectId,
        ref: 'Text',
        required: true
    },
    // Comentario opcional del profesor sobre por qué recomienda este texto
    comment: {
        type: String,
        maxlength: 500
    },
    // Estado de la recomendación
    status: {
        type: String,
        enum: ['pending', 'completed', 'dismissed'],
        default: 'pending'
    },
    // Tipo: recomendación (opcional) o asignación (obligatoria)
    type: {
        type: String,
        enum: ['recommendation', 'assignment'],
        default: 'recommendation'
    },
    // Fecha límite para asignaciones
    dueDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    // Fecha en que el estudiante completó el texto (si aplica)
    completedAt: {
        type: Date
    }
});

// Índice compuesto para consultas eficientes
textRecommendationSchema.index({ teacher: 1, student: 1 });
textRecommendationSchema.index({ student: 1, status: 1 });

module.exports = model('TextRecommendation', textRecommendationSchema);
