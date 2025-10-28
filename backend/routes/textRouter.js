const express = require('express');
const router = express.Router();

// Importamos los componentes necesarios
const createText = require('../controllers/createText'); // El controlador para crear textos.
const verifyToken = require('../middlewares/verifyToken'); // El middleware para proteger la ruta.

// Definimos la ruta para la creación de textos.
// POST /textos/
// Esta ruta está protegida. Primero se ejecuta `verifyToken` y si el token es válido, se pasa a `createText`.
router.post('/', verifyToken, createText);

// Aquí podríamos añadir más rutas en el futuro, como:
// router.get('/', verifyToken, getAllTexts); // Para obtener todos los textos del usuario.
// router.get('/:id', verifyToken, getTextById); // Para obtener un texto específico.

module.exports = router;