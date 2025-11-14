const express = require('express');
const router = express.Router();

// 1. Importamos el NUEVO controlador unificado
const authController = require('../controllers/authController.js');

// Ruta para registrar un nuevo usuario
// POST /auth/register
// Ahora apunta al método 'register' de authController
router.post('/register', authController.register);

// Ruta para iniciar sesión
// POST /auth/login
// Ahora apunta al método 'login' de authController
router.post('/login', authController.login);

module.exports = router;