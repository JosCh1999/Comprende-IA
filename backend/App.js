require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dbConnection = require('./database/db');
const authRouter = require('./routes/authRouter');
const textRouter = require('./routes/textRouter');

// Función para configurar y devolver la app
const create_app = () => {
    const app = express();

    // Middlewares
    app.use(cors());
    app.use(express.json());

    // Conexión a la base de datos
    // Se ejecutará solo una vez cuando se cree la app
    if (process.env.NODE_ENV !== 'test') {
        dbConnection();
    }

    // Rutas
    app.use('/auth', authRouter);
    app.use('/textos', textRouter);

    return app;
};

const app = create_app();

// Exportamos solo la app para que pueda ser utilizada por las pruebas y el servidor
module.exports = { app };
