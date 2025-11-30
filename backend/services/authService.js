const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usuario = require("../model/usuario"); // Ajustamos la ruta al modelo existente

// Importamos un posible manejador de errores centralizado que crearemos después
// const { AppError } = require("../utils/AppError"); 

/**
 * Registra un nuevo usuario en la base de datos.
 * Implementa la HU07 para asignar roles.
 * @param {object} userData - Datos del usuario { nombre, email, password, role }
 * @returns {object} El usuario creado (sin la contraseña)
 */
const registerUser = async (userData) => {
    const { nombre, email, password, role } = userData;

    if (!nombre || !email || !password) {
        // En una capa de servicio, es mejor lanzar errores que enviar respuestas.
        throw new Error("Faltan datos: nombre, email o password son requeridos");
    }

    const usuarioExistente = await Usuario.findOne({ correo: email });
    if (usuarioExistente) {
        throw new Error("El email ya está registrado");
    }

    // La lógica de hasheo ahora vive aquí, en el servicio.
    const contraseñaHasheada = await bcrypt.hash(password, 10);

    const nuevoUsuario = new Usuario({
        nombre,
        correo: email,
        contraseña: contraseñaHasheada,
        role: role || 'student' // HU07: Asignamos rol, por defecto 'student'
    });

    const usuarioGuardado = await nuevoUsuario.save();

    // El servicio devuelve los datos crudos. El controlador se encarga de la respuesta JSON.
    const respuestaUsuario = {
        _id: usuarioGuardado._id,
        nombre: usuarioGuardado.nombre,
        correo: usuarioGuardado.correo,
        role: usuarioGuardado.role
    };

    return respuestaUsuario;
};

/**
 * Autentica a un usuario y devuelve un token JWT.
 * @param {object} credentials - Credenciales del usuario { email, password }
 * @returns {object} El usuario logueado y el token.
 */
const loginUser = async (credentials) => {
    const { email, password } = credentials;

    if (!email || !password) {
        throw new Error("Faltan datos: email o password son requeridos");
    }

    // Buscamos al usuario por su correo
    const usuario = await Usuario.findOne({ correo: email });
    if (!usuario) {
        throw new Error("Credenciales incorrectas"); // Mensaje genérico por seguridad
    }

    // Comparamos la contraseña
    const esCorrecta = await bcrypt.compare(password, usuario.contraseña);
    if (!esCorrecta) {
        throw new Error("Credenciales incorrectas");
    }

    // Creamos el payload para el token
    const payload = {
        id: usuario._id,
        role: usuario.role // HU07: Incluimos el rol en el token
    };

    // Firmamos el token
    const secret = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign(payload, secret, {
        expiresIn: '24h',
    });

    return {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        role: usuario.role,
        token: token,
    };
};


module.exports = {
    registerUser,
    loginUser,
};