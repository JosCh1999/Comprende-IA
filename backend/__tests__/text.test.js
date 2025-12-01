const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../App'); // Import only the app
const User = require('../model/usuario');
const Text = require('../model/text');
const jwt = require('jsonwebtoken');

let server;
let token;
let userId;

beforeAll(async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/testdb_texts';
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

  server = app.listen(); // Start server on a random available port

  await User.deleteMany({});
  await Text.deleteMany({});

  const user = await new User({ nombre: 'Text User', correo: 'textuser@example.com', contraseña: 'password123' }).save();
  userId = user._id;
  token = jwt.sign({ id: userId, nombre: user.nombre }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
});

// MODERNIZED afterAll BLOCK
afterAll(async () => {
  await mongoose.connection.close();
  await new Promise(resolve => server.close(resolve));
});

describe('API de Textos - POST /textos', () => {

  afterEach(async () => {
    await Text.deleteMany({});
  });

  it('debería crear un nuevo texto exitosamente con un token válido', async () => {
    const response = await request(app)
      .post('/textos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        filename: 'mi_archivo.txt',
        content: 'Este es un texto de prueba con filename.'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Texto creado exitosamente');
    expect(response.body.text).toHaveProperty('filename', 'mi_archivo.txt');
    expect(response.body.text).toHaveProperty('content', 'Este es un texto de prueba con filename.');
  });

  it('debería devolver un error 401 (No Autorizado) si no se proporciona un token', async () => {
    const response = await request(app)
      .post('/textos')
      .send({
        filename: 'sin_token.txt',
        content: 'Este contenido no debería guardarse.'
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.mensaje).toBe('Acceso denegado. Token no proporcionado o con formato incorrecto.');
  });

  it('debería devolver un error 400 (Bad Request) si falta el campo \'filename\'', async () => {
    const response = await request(app)
      .post('/textos')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Contenido sin filename.' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  it('debería devolver un error 400 (Bad Request) si falta el campo \'content\'', async () => {
    const response = await request(app)
      .post('/textos')
      .set('Authorization', `Bearer ${token}`)
      .send({ filename: 'sin_contenido.txt' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

});
