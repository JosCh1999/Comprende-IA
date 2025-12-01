const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../App'); // Import only the app
const User = require('../model/usuario');

let server; // To hold server instance

beforeAll(async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/testdb_auth';
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  server = app.listen(); // Start server on a random available port
});

afterEach(async () => {
  await User.deleteMany({});
});

// MODERNIZED afterAll BLOCK
afterAll(async () => {
  await mongoose.connection.close();
  await new Promise(resolve => server.close(resolve));
});

describe('Auth API - /auth/register', () => {
  it('debería registrar un nuevo usuario exitosamente', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        nombre: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'Usuario registrado exitosamente');
    expect(response.body.usuario).toHaveProperty('nombre', 'Test User');
    expect(response.body.usuario).toHaveProperty('correo', 'test@example.com');
    expect(response.body.usuario).not.toHaveProperty('contraseña');
  });

  it('debería fallar si el email ya está registrado (409)', async () => {
    await new User({ nombre: 'Existing User', correo: 'test@example.com', contraseña: 'hashedpassword' }).save();

    const response = await request(app)
      .post('/auth/register')
      .send({
        nombre: 'Another User',
        email: 'test@example.com',
        password: 'anotherpassword',
      });

    expect(response.statusCode).toBe(409);
    expect(response.body).toHaveProperty('message', 'El email ya está registrado');
  });

  it('debería fallar si falta el email (400)', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        nombre: 'Test User',
        password: 'password123',
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message');
  });
});

describe('Auth API - /auth/login', () => {
  beforeEach(async () => {
    await request(app)
      .post('/auth/register')
      .send({
        nombre: 'Login User',
        email: 'login@example.com',
        password: 'password123',
      });
  });

  it('debería iniciar sesión con credenciales correctas y devolver un token', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'login@example.com',
        password: 'password123',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Usuario logueado exitosamente');
    expect(response.body.usuario).toHaveProperty('token');
    expect(response.body.usuario.nombre).toBe('Login User');
  });

  it('debería fallar con una contraseña incorrecta (401)', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'login@example.com',
        password: 'wrongpassword',
      });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message', 'Credenciales incorrectas');
  });

  it('debería fallar con un email incorrecto (401)', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'wrong@example.com',
        password: 'password123',
      });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message', 'Credenciales incorrectas');
  });

  it('debería fallar si falta el password (400)', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'login@example.com',
      });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message');
  });
});
