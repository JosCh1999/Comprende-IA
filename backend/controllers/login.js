const bcrypt = require("bcrypt");
const Usuario = require("../model/usuario");
const jwt = require("jsonwebtoken");


const login = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      
      return res.status(404).json({ mensaje: "Usuario no encontrado o credenciales incorrectas." });
    }

    
    const esCorrecta = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!esCorrecta) {
      
      return res.status(401).json({ mensaje: "Usuario no encontrado o credenciales incorrectas." });
    }

    
    const { id, nombre } = usuario;
    const data = { id, nombre };

    
    const token = jwt.sign(data, process.env.JWT_SECRET || 'secreto', {
      expiresIn: '24h',
    });

    
    res.json({
      mensaje: "Usuario logeado correctamente",
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