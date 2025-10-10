const Usuario = require("../model/usuario");

const getUserById = async (req, res) => {
  // FIX: Get the ID from the URL parameters (req.params) instead of req.user
  const { id } = req.params;

  // Check if the ID has a valid format (24 hex characters)
  if (id && id.length === 24 && /^[0-9a-fA-F]+$/.test(id)) {
    try {
      const usuario = await Usuario.findById(id);

      if (!usuario) {
        return res.status(404).json({
          mensaje: "No se encontro ningun usuario con esa ID",
        });
      } else {
        // Return user data, excluding sensitive fields
        const { contraseña, __v, ...resto } = usuario._doc;
        res.json(resto);
      }
    } catch (error) {
      res.status(500).json({ mensaje: "Error interno del servidor al buscar el usuario", error: error.message });
    }
  } else {
    // FIX: Provide a clear error message for invalid IDs
    res.status(400).json({ mensaje: "El ID proporcionado no es válido." });
  }
};

module.exports = getUserById;