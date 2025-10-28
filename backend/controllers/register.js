const bcrypt = require("bcrypt");
const Usuario = require("../model/usuario");

const register = async (req, res) => {
    // Aceptamos { nombre, email, password } desde el cliente (frontend/Postman)
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
        return res.status(400).json({ mensaje: "Faltan datos: nombre, email o password son requeridos" });
    }

    try {
        // Buscamos en la BD usando el campo 'correo'
        const usuarioExistente = await Usuario.findOne({ correo: email });

        if (usuarioExistente) {
            return res.status(409).json({ mensaje: "El email ya está registrado" });
        }

        const contraseñaHasheada = await bcrypt.hash(password, 10);

        const nuevoUsuario = new Usuario({
            nombre,
            correo: email, // Guardamos el 'email' en el campo 'correo' del modelo
            contraseña: contraseñaHasheada,
        });

        const usuarioGuardado = await nuevoUsuario.save();

        // Creamos un objeto de respuesta sin la contraseña
        const respuestaUsuario = {
            _id: usuarioGuardado._id,
            nombre: usuarioGuardado.nombre,
            correo: usuarioGuardado.correo
        };

        res.status(201).json({ mensaje: "Usuario registrado exitosamente", usuario: respuestaUsuario });

    } catch (error) {
        res.status(500).json({ mensaje: "Error del servidor al registrar el usuario", error: error.message });
    }
};

module.exports = register;