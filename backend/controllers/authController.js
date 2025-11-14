const authService = require('../services/authService.js');

/**
 * Controlador para manejar el registro de un nuevo usuario.
 * Es un controlador "delgado": solo pasa la petición al servicio y formatea la respuesta.
 */
const register = async (req, res) => {
    try {
        // 1. Llama al servicio para ejecutar la lógica de negocio.
        const registeredUser = await authService.registerUser(req.body);
        
        // 2. Si todo va bien, envía una respuesta exitosa.
        res.status(201).json({
            message: "Usuario registrado exitosamente",
            usuario: registeredUser
        });

    } catch (error) {
        // 3. Si el servicio lanza un error, lo captura y envía una respuesta de error apropiada.
        // Usamos un switch para un manejo de errores más limpio y escalable.
        switch (error.message) {
            case "El email ya está registrado":
                res.status(409).json({ message: error.message });
                break;
            case "Faltan datos: nombre, email o password son requeridos":
                res.status(400).json({ message: error.message });
                break;
            default:
                res.status(500).json({ message: "Error interno del servidor al registrar." });
                break;
        }
    }
};

/**
 * Controlador para manejar el login de un usuario.
 */
const login = async (req, res) => {
    try {
        // 1. Llama al servicio para la autenticación.
        const loginData = await authService.loginUser(req.body);
        
        // 2. Envía la respuesta con el token y los datos del usuario.
        res.status(200).json({
            message: "Usuario logueado exitosamente",
            usuario: loginData
        });

    } catch (error) {
        // 3. Para el login, por seguridad, siempre devolvemos un error genérico 401.
        res.status(401).json({ message: "Credenciales incorrectas" });
    }
};

module.exports = {
    register,
    login
};
