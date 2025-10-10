require('dotenv').config(); // Carga las variables de entorno

const express = require("express");
const cors = require("cors");
const multer = require('multer');
const dbConnection = require("./database/db"); // Importamos la función de conexión

const authControllers = require('./controllers');
const { uploadText, saveText } = require('./controllers/textController'); 
const { generateQuestions, detectFallacies } = require('./controllers/aiController');
const verifyToken = require("./middlewares/verifyToken");

const app = express();

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Configuración de Multer ---
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- Rutas ---
app.get('/user/:id', authControllers.getUserById);
app.post('/register', authControllers.register);
app.post('/login', authControllers.login);
app.post('/api/upload', upload.single('file'), uploadText);
app.post('/api/save-text', saveText);
app.get('/api/analyze/:textId/questions', generateQuestions);
app.get('/api/analyze/:textId/fallacies', detectFallacies);

// --- Inicio del Servidor ---
const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
    // Solo conectar a la BD si NO estamos en entorno de prueba
    if (process.env.NODE_ENV !== 'test') {
        dbConnection(); // Llamamos a la función de conexión
    }
});

// Exportamos la app y el servidor
module.exports = { app, server };
