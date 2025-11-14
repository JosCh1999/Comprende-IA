
const { Router } = require("express");
const verifyToken = require("../middlewares/verifyToken");
const { 
    createAttemptHandler, 
    getAttemptByUserAndTextHandler // Importamos el nuevo handler
} = require('../controllers/attemptController');

const router = Router();

// @route   POST /api/attempts
// @desc    Recibe, evalúa y guarda un intento de resolución de preguntas.
// @access  Private
router.post("/", verifyToken, createAttemptHandler);

// @route   GET /api/attempts/:textId/my-attempt
// @desc    Busca si el usuario actual ya ha realizado un intento para un texto específico.
// @access  Private
router.get("/:textId/my-attempt", verifyToken, getAttemptByUserAndTextHandler);


module.exports = router;