const mongoose = require('mongoose');
const dbConnection = require('../database/db');

// Mockear todo el módulo de mongoose
jest.mock('mongoose');

// Espiar las funciones de consola para verificar que se llamen
beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

// Restaurar los mocks después de cada prueba
afterEach(() => {
  jest.restoreAllMocks();
});

describe('dbConnection', () => {
  it('debería conectarse a la base de datos y mostrar un mensaje de éxito', async () => {
    // Simular que la conexión es exitosa
    mongoose.connect.mockResolvedValue(true);

    await dbConnection();

    // Verificar que se intentó conectar con la URI correcta (o la de por defecto)
    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase');
    // Verificar que se mostró el mensaje de éxito
    expect(console.log).toHaveBeenCalledWith('✅ Conexión a la base de datos exitosa.');
  });

  it('debería lanzar un error si la conexión a la base de datos falla', async () => {
    const mockError = new Error('Error de conexión simulado');
    // Simular que la conexión falla
    mongoose.connect.mockRejectedValue(mockError);

    // Verificar que la función dbConnection arroja una excepción
    await expect(dbConnection()).rejects.toThrow('Error en la conexión a la base de datos');

    // Verificar que se mostró el mensaje de error en la consola
    expect(console.error).toHaveBeenCalledWith('❌ Error en la conexión a la base de datos:', mockError);
  });
});