const { app } = require('./App');

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Exportamos el servidor para poder cerrarlo en las pruebas
module.exports = { server };