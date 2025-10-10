const bcrypt = require("bcrypt");
const Usuario = require("../model/usuario");
const jwt = require("jsonwebtoken");

// --- Refactor to use async/await and robust error handling ---
const login = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    // 1. Find the user by email
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      // Use 401 for unauthorized as per test
      return res.status(401).json({ mensaje: "Credenciales incorrectas" });
    }

    // 2. Compare passwords
    const esCorrecta = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!esCorrecta) {
      // Use 401 for unauthorized
      return res.status(401).json({ mensaje: "Credenciales incorrectas" });
    }

    // 3. If credentials are correct, create token
    const { id, nombre } = usuario;
    const data = { id, nombre }; // Payload for the token

    // Use environment variable for secret key for better security
    const token = jwt.sign(data, process.env.JWT_SECRET || 'secreto', {
      expiresIn: '24h',
    });

    // 4. Send successful response
    res.json({
      mensaje: "Usuario logueado",
      usuario: {
        id,
        nombre,
        token,
      },
    });

  } catch (error) {
    // 5. Catch any unexpected server error
    console.error("Error en el proceso de login:", error);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};

module.exports = login;