const Text = require('../model/text');
const Usuario = require('../model/usuario');

// @desc    Crear un nuevo texto
// @route   POST /textos
// @access  Privado
const crearTexto = async (req, res) => {
  const { content } = req.body;

  if (!content || content.trim() === '') {
    return res.status(400).json({ mensaje: 'El contenido no puede estar vacío' });
  }

  try {
    // El ID del usuario se obtiene del token decodificado (añadido por verifyToken)
    const userId = req.user.id;

    const newText = new Text({
      content,
      owner: userId, // Asociamos el texto con el usuario propietario
    });

    const textoGuardado = await newText.save();

    res.status(201).json({
      mensaje: 'Texto creado exitosamente',
      texto: textoGuardado,
    });
  } catch (error) {
    console.error('Error al crear el texto:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// @desc    Obtener todos los textos del usuario logueado
// @route   GET /textos
// @access  Privado
const obtenerTextos = async (req, res) => {
  try {
    // Busca todos los textos cuyo campo 'owner' coincida con el ID del usuario del token
    const textos = await Text.find({ owner: req.user.id });

    if (!textos) {
      return res.status(404).json({ mensaje: 'No se encontraron textos para este usuario' });
    }

    res.json(textos);
  } catch (error) {
    console.error('Error al obtener los textos:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// @desc    Obtener un texto específico por su ID
// @route   GET /textos/:id
// @access  Privado
const obtenerTextoPorId = async (req, res) => {
  try {
    const texto = await Text.findById(req.params.id);

    if (!texto) {
      return res.status(404).json({ mensaje: 'Texto no encontrado' });
    }

    // Verificamos que el texto pertenezca al usuario que hace la solicitud
    if (texto.owner.toString() !== req.user.id) {
      // Usamos 404 para no revelar la existencia del recurso a usuarios no autorizados
      return res.status(404).json({ mensaje: 'Texto no encontrado' });
    }

    res.json(texto);
  } catch (error) {
    console.error('Error al obtener el texto por ID:', error);
    // Si el ID tiene un formato inválido, Mongoose arroja un error
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Texto no encontrado (ID inválido)' });
    }
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

module.exports = { crearTexto, obtenerTextos, obtenerTextoPorId };
