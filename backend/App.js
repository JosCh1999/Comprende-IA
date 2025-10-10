require('dotenv').config(); // Carga las variables de entorno

const express = require("express");
const cors = require("cors");
const multer = require('multer');
const db = require("./database/db");

const authControllers = require('./controllers');
// Importamos tanto saveText como uploadText
const { uploadText, saveText } = require('./controllers/textController'); 
const { generateQuestions, detectFallacies } = require('./controllers/aiController');
const verifyToken = require("./middlewares/verifyToken");

const app = express();

// --- Middlewares ---
app.use(cors());
app.use(express.json()); // Middleware para parsear JSON

// --- Configuración de Multer (para subida de archivos) ---
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- Rutas ---

// Rutas de Autenticación y Usuarios
app.get('/user/:id', authControllers.getUserById);
app.post('/register', authControllers.register);
app.post('/login', authControllers.login);

// Ruta para la subida de archivos .txt (si se necesita en el futuro)
app.post('/api/upload', upload.single('file'), uploadText);

// NUEVA RUTA: Ruta para guardar texto plano desde el frontend
app.post('/api/save-text', saveText); // No usa multer, usa express.json()

// Rutas para el análisis con IA
app.get('/api/analyze/:textId/questions', generateQuestions);
app.get('/api/analyze/:textId/fallacies', detectFallacies);


// --- Inicio del Servidor ---
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
    db(); // Conecta a la base de datos
});

module.exports = app;