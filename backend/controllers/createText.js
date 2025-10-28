const Texto = require('../model/text');

const createText = async (req, res) => {
  // 1. Extraemos 'filename' y 'content' del cuerpo de la petición.
  const { filename, content } = req.body;

  // Verificación de que tenemos los datos necesarios según el modelo.
  if (!filename || !content) {
    return res.status(400).json({ mensaje: 'Los campos \'filename\' y \'content\' son obligatorios.' });
  }

  try {
    // 2. Creamos una nueva instancia del modelo `Texto` con los datos correctos.
    const nuevoTexto = new Texto({
      filename,
      content,
    });

    // 3. Guardamos el nuevo texto en la base de datos.
    const textoGuardado = await nuevoTexto.save();

    // 4. Respondemos al cliente con un código 201 (Created) y los datos del texto guardado.
    res.status(201).json({
      mensaje: 'Texto creado exitosamente',
      texto: textoGuardado,
    });

  } catch (error) {
    // Capturamos cualquier error durante el proceso de guardado en la BD.
    console.error("Error al crear el texto:", error);
    res.status(500).json({ mensaje: 'Error interno del servidor al guardar el texto.' });
  }
};

module.exports = createText;