const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController.js');
const verifyToken = require('../middlewares/verifyToken.js');

// Ruta para generar preguntas (devuelve JSON)
// POST /ai/generate-questions/:textId
router.post('/generate-questions/:textId', verifyToken, aiController.generateQuestions);

// Ruta para detectar falacias (devuelve JSON)
// POST /ai/detect-fallacies/:textId
router.post('/detect-fallacies/:textId', verifyToken, aiController.detectFallacies);

// HU-02: Ruta para exportar las preguntas generadas a un archivo CSV
// GET /ai/export-questions/:textId/csv
router.get('/export-questions/:textId/csv', verifyToken, aiController.exportQuestionsToCsv);


module.exports = router;