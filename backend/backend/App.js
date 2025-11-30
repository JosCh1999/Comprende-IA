
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dbConnection = require('./database/db');
const authRouter = require('./routes/authRouter');
const textRouter = require('./routes/textRouter');
const aiRouter = require('./routes/aiRouter');
const attemptRouter = require('./routes/attemptRouter'); // Importamos el router de intentos

// Función para configurar y devolver la app
const create_app = () => {
    const app = express();

    // Middlewares
    app.use(cors());
    app.use(express.json());

    // Conexión a la base de datos
    if (process.env.NODE_ENV !== 'test') {
        dbConnection();
    }

    // Rutas
    app.use('/auth', authRouter);
    app.use('/textos', textRouter);
    app.use('/ai', aiRouter);
    app.use('/attempts', attemptRouter); // Montamos el nuevo enrutador en /attempts

    return app;
};

const app = create_app();

// Exportamos solo la app para que pueda ser utilizada por las pruebas y el servidor
module.exports = { app };
