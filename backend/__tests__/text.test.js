const request = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('../App');
const Text = require('../model/text');

beforeAll(async () => {
  const mongoUri = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/testdb-text';
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterEach(async () => {
  await Text.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});

describe('Text API - /api/save-text', () => {
  it('debería guardar el texto exitosamente cuando el texto es válido', async () => {
    const response = await request(app)
      .post('/api/save-text')
      .send({ text: 'Este es un texto de prueba.' });

    expect(response.statusCode).toBe(201);
    const savedText = await Text.findById(response.body.textId);
    expect(savedText).not.toBeNull();
    expect(savedText.content).toBe('Este es un texto de prueba.');
  });

  it('no debería guardar el texto si el campo de texto está vacío', async () => {
    const response = await request(app)
      .post('/api/save-text')
      .send({ text: '   ' });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('El texto no puede estar vacío.');
  });
});

describe('Text API - /api/upload', () => {
  it('debería subir y procesar un archivo .txt exitosamente', async () => {
    const fileContent = 'Contenido de prueba del archivo.';
    const response = await request(app)
      .post('/api/upload')
      .attach('file', Buffer.from(fileContent), {
        filename: 'test.txt',
        contentType: 'text/plain'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('¡Archivo subido y procesado con éxito!');
    expect(response.body.textId).toBeDefined();

    const savedText = await Text.findById(response.body.textId);
    expect(savedText).not.toBeNull();
    expect(savedText.content).toBe(fileContent);
    expect(savedText.filename).toBe('test.txt');
  });

  it('debería devolver 400 si no se sube ningún archivo', async () => {
    const response = await request(app).post('/api/upload');

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('No se ha subido ningún archivo.');
  });

  it('debería devolver 400 si el tipo de archivo no es .txt', async () => {
    const response = await request(app)
      .post('/api/upload')
      .attach('file', Buffer.from('fake image data'), {
        filename: 'image.png',
        contentType: 'image/png'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Solo se admiten archivos .txt');
  });
  
});

