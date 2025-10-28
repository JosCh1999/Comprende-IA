const bcrypt = require("bcrypt");
const Usuario = require("../model/usuario");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).json({ mensaje: "Faltan datos: email o password son requeridos" });
  }

  try {
    const usuario = await Usuario.findOne({ correo: email });
    if (!usuario) {
      return res.status(401).json({ mensaje: "Credenciales incorrectas" });
    }

    const esCorrecta = await bcrypt.compare(password, usuario.contraseña);
    if (!esCorrecta) {
      return res.status(401).json({ mensaje: "Credenciales incorrectas" });
    }

    const { _id: id, nombre } = usuario;
    const payload = { id }; // Simplificamos el payload al ID, es más seguro.

    
    const secret = process.env.JWT_SECRET || 'secret'; 
    const token = jwt.sign(payload, secret, {
      expiresIn: '24h', // Tiempo de expiración de 24 horas.
    });

    res.json({
      mensaje: "Usuario logueado exitosamente",
      usuario: {
        id,
        nombre,
        token,
      },
    });

  } catch (error) {
    console.error("Error en el proceso de login:", error);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};

module.exports = login;