const express = require("express");
const cors = require("cors");
const db = require("./database/db");

const controllers = require('./controllers');
const verifyToken = require("./middlewares/verifyToken");    

const app = express();

app.use(cors());
app.use(express.json());

// Tus rutas
app.get('/user/:id', controllers.getUserById);
app.post('/register', controllers.register);
app.post('/login', controllers.login);

const PORT = 4000;

// 1. Creas la función asíncrona para iniciar todo
app.listen(PORT, () =>{
    console.log(`Servidor escuchando en el puerto ${PORT}`);
    db();
});

module.exports = app;