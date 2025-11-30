const { model, Schema } = require("mongoose");

/**
 * Modelo de Enrollment (Inscripción)
 * Representa la relación entre un profesor y un estudiante.
 * Un profesor puede tener múltiples estudiantes, y un estudiante puede tener múltiples profesores.
 */
const enrollmentSchema = new Schema({
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
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    // Estado activo/inactivo por si el profesor quiere "dar de baja" a un estudiante
    isActive: {
        type: Boolean,
        default: true
    }
});

// Índice compuesto para evitar duplicados y mejorar consultas
enrollmentSchema.index({ teacher: 1, student: 1 }, { unique: true });

module.exports = model('Enrollment', enrollmentSchema);
