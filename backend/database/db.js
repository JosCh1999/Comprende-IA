const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase';
    await mongoose.connect(mongoUri);
    console.log("✅ Conexión a la base de datos exitosa.");
  } catch (error) {
    console.error("❌ Error en la conexión a la base de datos:", error);
    throw new Error("Error en la conexión a la base de datos");
  }
};

module.exports = dbConnection;