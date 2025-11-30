const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');

// Todas las rutas requieren autenticación Y rol de estudiante
const studentAuth = [verifyToken, verifyRole(['student'])];

// Ver recomendaciones de textos del profesor
router.get('/recommendations', studentAuth, studentController.getMyRecommendationsHandler);
router.get('/recommendations/:textId', studentAuth, studentController.getTextRecommendationHandler);

// Ver progreso del estudiante
router.get('/progress', studentAuth, studentController.getMyProgressHandler);

module.exports = router;
