const request = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('../App');
const Text = require('../model/text');

// Mock de las funciones del flow para evitar llamadas reales a la IA
jest.mock('../flow', () => ({
  generateQuestionsFlow: jest.fn(),
  detectFallaciesFlow: jest.fn(),
}));

const { generateQuestionsFlow, detectFallaciesFlow } = require('../flow');

beforeAll(async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/testdb';
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterEach(async () => {
  await Text.deleteMany({});
  // Limpiar los mocks después de cada prueba
  generateQuestionsFlow.mockClear();
  detectFallaciesFlow.mockClear();
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});

describe('AI Controller API', () => {

  describe('GET /api/analyze/:textId/questions', () => {
    it('debería generar preguntas para un texto válido', async () => {
      // 1. Crear un texto de prueba en la BD
      const newText = new Text({ content: 'Este es un texto para generar preguntas.', filename: 'test.txt' });
      await newText.save();

      // 2. Configurar el mock para que devuelva una respuesta simulada
      const mockResponse = { questions: ['¿Pregunta 1?', '¿Pregunta 2?'] };
      generateQuestionsFlow.mockResolvedValue(mockResponse);

      // 3. Hacer la petición a la API
      const response = await request(app).get(`/api/analyze/${newText._id}/questions`);

      // 4. Verificar los resultados
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockResponse);
      // Verificar que la función del flow fue llamada con el contenido correcto
      expect(generateQuestionsFlow).toHaveBeenCalledWith('Este es un texto para generar preguntas.');
    });

    it('debería devolver 404 si el texto no se encuentra', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/api/analyze/${nonExistentId}/questions`);

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Texto no encontrado.');
    });
  });

  describe('GET /api/analyze/:textId/fallacies', () => {
    it('debería detectar falacias para un texto válido', async () => {
      const newText = new Text({ content: 'Este es un texto para detectar falacias.', filename: 'test.txt' });
      await newText.save();

      const mockResponse = { fallacies: ['Falacia de ejemplo'] };
      detectFallaciesFlow.mockResolvedValue(mockResponse);

      const response = await request(app).get(`/api/analyze/${newText._id}/fallacies`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(detectFallaciesFlow).toHaveBeenCalledWith('Este es un texto para detectar falacias.');
    });

    it('debería devolver 404 si el texto no se encuentra', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/api/analyze/${nonExistentId}/fallacies`);

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Texto no encontrado.');
    });
  });
});