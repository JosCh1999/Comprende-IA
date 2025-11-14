const {model, Schema} = require("mongoose");

const UsuarioSchema = new Schema ({
    nombre: {type: String, required: true},
    correo: {type: String, required: true, unique: true},
    contraseña: {type: String, required: true},
    role: {
        type: String,
        required: true,
        enum: ['student', 'teacher'],
        default: 'student'
    }
});

module.exports = model("Usuario" , UsuarioSchema);