const express = require('express');
const router = express.Router();

// Importamos los controladores de autenticación
const register = require('../controllers/register');
const login = require('../controllers/login');

// Ruta para registrar un nuevo usuario
// POST /auth/register
router.post('/register', register);

// Ruta para iniciar sesión
// POST /auth/login
router.post('/login', login);

module.exports = router;