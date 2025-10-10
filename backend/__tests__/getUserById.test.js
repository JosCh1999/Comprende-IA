const request = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('../App');
const Usuario = require('../model/usuario');

beforeAll(async () => {
  const mongoUri = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/testdb-user';
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterEach(async () => {
  await Usuario.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});

describe('GET /user/:id', () => {

  it('debería devolver los datos del usuario si el ID es válido y el usuario existe', async () => {
    const mockUser = await new Usuario({ nombre: 'Test User', correo: 'test@example.com', contraseña: 'password123' }).save();
    
    const response = await request(app).get(`/user/${mockUser._id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.nombre).toBe('Test User');
    expect(response.body.correo).toBe('test@example.com');
    expect(response.body.contraseña).toBeUndefined(); // Asegurarse de que la contraseña no se devuelve
  });

  it('debería devolver 404 si el usuario con el ID dado no existe', async () => {
    const nonExistentId = new mongoose.Types.ObjectId(); // ID válido pero no existente
    const response = await request(app).get(`/user/${nonExistentId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.mensaje).toBe('No se encontro ningun usuario con esa ID');
  });

  it('debería devolver 400 si el ID proporcionado no es válido', async () => {
    const invalidId = '12345'; // ID con formato incorrecto
    const response = await request(app).get(`/user/${invalidId}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.mensaje).toBe('El ID proporcionado no es válido.');
  });

  it('debería devolver 500 si hay un error en el servidor', async () => {
    // Forzamos un error cerrando la conexión a la BD temporalmente
    await mongoose.connection.close();

    const mockUser = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/user/${mockUser._id}`);
    
    expect(response.statusCode).toBe(500);
    expect(response.body.mensaje).toContain('Error interno del servidor');

    // Restablecemos la conexión para las otras pruebas
    const mongoUri = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/testdb-user';
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

});