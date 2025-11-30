
const express = require('express');
const router = express.Router();

// Importamos los controladores y middlewares necesarios
const textController = require('../controllers/textController.js');
const verifyToken = require('../middlewares/verifyToken.js');
const upload = require('../middlewares/upload.js');

// --- Rutas de Textos ---

// HU-01: Subir un archivo de texto.
router.post('/upload', verifyToken, upload.single('file'), textController.uploadText);

// Crear un nuevo texto (vía JSON, para pruebas).
router.post('/', verifyToken, textController.createText);

// Obtener todos los textos del usuario.
router.get('/', verifyToken, textController.getAllTexts);

// --- ¡NUEVA RUTA! ---
// Obtener un texto específico por su ID. Debe ir antes que rutas más generales.
router.get('/:id', verifyToken, textController.getTextById);


module.exports = router;