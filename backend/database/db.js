const mongoose = require("mongoose");
require("dotenv").config(); // Carga las variables del archivo .env

// Lee la URL de la base de datos desde las variables de entorno
const MONGO_URI = process.env.MONGO_URI;

const db = async () => {
  try {
    // Asegurarse de que MONGO_URI está definida
    if (!MONGO_URI) {
      throw new Error("No se ha definido la variable MONGO_URI en el archivo .env");
    }
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conexión a la base de datos exitosa.");
  } catch (error) {
    console.error("❌ Error conectando a la base de datos:", error.message);
    // Detener el proceso si no nos podemos conectar a la BD
    process.exit(1); 
  }
};

module.exports = db;