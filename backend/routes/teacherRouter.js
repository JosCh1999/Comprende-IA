const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');

// Todas las rutas requieren autenticación Y rol de profesor
const teacherAuth = [verifyToken, verifyRole(['teacher'])];

// Gestión de estudiantes
router.post('/students/enroll', teacherAuth, teacherController.enrollStudentHandler);
router.get('/students', teacherAuth, teacherController.getEnrolledStudentsHandler);
router.get('/students/:studentId/progress', teacherAuth, teacherController.getStudentProgressHandler);
router.get('/students/:studentId/texts', teacherAuth, teacherController.getStudentTextsHandler);

// Recomendaciones de textos
router.post('/students/:studentId/recommend', teacherAuth, teacherController.recommendTextHandler);
router.get('/recommendations/:textId', teacherAuth, teacherController.getTextRecommendationHandler);

// Detalle de intentos y descarga de textos
router.get('/attempts/:attemptId', teacherAuth, teacherController.getAttemptDetailHandler);
router.get('/texts/:textId/download', teacherAuth, teacherController.downloadTextHandler);

// Exportación de reportes
const exportController = require('../controllers/exportController');
router.get('/students/:studentId/export/excel', teacherAuth, exportController.exportStudentProgressToExcel);

module.exports = router;
