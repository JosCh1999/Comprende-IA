
const request = require('supertest');
const mongoose = require('mongoose');
// Importamos app y server desde App.js
const { app, server } = require('../App'); 
const User = require('../model/usuario');

// Conectarse a una base de datos de prueba
beforeAll(async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/testdb';
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Limpiar la base de datos después de cada prueba
afterEach(async () => {
  await User.deleteMany({});
});

// Desconectarse de la base de datos y cerrar el servidor después de todas las pruebas
afterAll(async () => {
  await mongoose.connection.close();
  server.close(); // Cerramos el servidor
});

describe('Auth API', () => {

  // ---- Pruebas para el endpoint de Registro ---- //
  it('debería registrar un nuevo usuario exitosamente', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        nombre: 'Test User',
        correo: 'test@example.com',
        contraseña: 'password123',
      });
    
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('mensaje', 'Usuario registrado exitosamente');
  });

  it('no debería registrar un usuario con un correo que ya existe', async () => {
    const user = new User({ nombre: 'Test User', correo: 'test@example.com', contraseña: 'password123' });
    await user.save();

    const response = await request(app)
      .post('/register')
      .send({
        nombre: 'Another User',
        correo: 'test@example.com',
        contraseña: 'anotherpassword',
      });

    expect(response.statusCode).toBe(409);
    expect(response.body).toHaveProperty('mensaje', 'El correo ya está registrado');
  });


  // ---- Pruebas para el endpoint de Login ---- //
  it('debería iniciar sesión con credenciales correctas', async () => {
    await request(app)
      .post('/register')
      .send({
        nombre: 'Test User',
        correo: 'login@example.com',
        contraseña: 'password123',
      });
      
    const response = await request(app)
      .post('/login')
      .send({
        correo: 'login@example.com',
        contraseña: 'password123',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('mensaje', 'Usuario logueado');
    expect(response.body.usuario).toHaveProperty('token');
  });

  it('no debería iniciar sesión con una contraseña incorrecta', async () => {
     await request(app)
      .post('/register')
      .send({
        nombre: 'Test User',
        correo: 'login@example.com',
        contraseña: 'password123',
      });

    const response = await request(app)
      .post('/login')
      .send({
        correo: 'login@example.com',
        contraseña: 'wrongpassword',
      });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('mensaje', 'Credenciales incorrectas');
  });
});
