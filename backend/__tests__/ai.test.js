const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../App');
const User = require('../model/usuario');
const Text = require('../model/text');
const Pregunta = require('../model/pregunta');
const jwt = require('jsonwebtoken');

// Mock del servicio de IA para no gastar cuota ni depender de la API externa
jest.mock('../services/aiService', () => ({
    generateQuestions: jest.fn().mockResolvedValue({
        questions: [
            { level: 'Literal', question: '¿Qué pasó?' },
            { level: 'Inferencial', question: '¿Por qué pasó?' }
        ]
    }),
    detectFallacies: jest.fn().mockResolvedValue({
        analysis: {
            falacias: [{ tipo: 'Ad Hominem', descripcion: 'Ataque personal' }],
            sesgos: ['Confirmación'],
            resumen: 'Resumen de prueba'
        }
    })
}));

let server;
let token;
let userId;
let textId;

beforeAll(async () => {
    const mongoUri = 'mongodb://localhost:27017/testdb_ai_' + Date.now();
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    }
    server = app.listen();

    await User.deleteMany({});
    await Text.deleteMany({});
    await Pregunta.deleteMany({});

    const user = await new User({
        nombre: 'AI User',
        correo: 'ai@test.com',
        contraseña: 'password123',
        role: 'student'
    }).save();
    userId = user._id;
    token = jwt.sign({ id: userId, role: 'student' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    const text = await new Text({
        filename: 'ai_text.txt',
        content: 'Contenido para IA',
        owner: userId
    }).save();
    textId = text._id;
});

afterAll(async () => {
    await mongoose.connection.close();
    await new Promise(resolve => server.close(resolve));
});

describe('AI API', () => {

    it('POST /ai/generate-questions/:textId - debería generar preguntas', async () => {
        const response = await request(app)
            .post(`/ai/generate-questions/${textId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('message', 'Preguntas generadas y guardadas exitosamente.');
        expect(response.body.questions).toHaveLength(2);
    });

    it('POST /ai/generate-questions/:textId - debería devolver existentes si ya se generaron', async () => {
        const response = await request(app)
            .post(`/ai/generate-questions/${textId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Las preguntas para este texto ya han sido generadas.');
    });

    it('POST /ai/detect-fallacies/:textId - debería detectar falacias', async () => {
        const response = await request(app)
            .post(`/ai/detect-fallacies/${textId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('message', 'Análisis de falacias generado y guardado exitosamente.');
        expect(response.body.analysis).toHaveProperty('resumen', 'Resumen de prueba');
    });

    it('GET /ai/export-questions/:textId - debería exportar preguntas a CSV', async () => {
        // Crear preguntas antes de exportar
        await Pregunta.insertMany([
            { textId: textId, level: 'Literal', question: '¿Q1?' },
            { textId: textId, level: 'Inferencial', question: '¿Q2?' }
        ]);

        const response = await request(app)
            .get(`/ai/export-questions/${textId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.header['content-type']).toContain('text/csv');
    });

    it('POST /ai/generate-questions/:textId - debería fallar si el texto no existe (404)', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const response = await request(app)
            .post(`/ai/generate-questions/${fakeId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(404);
    });

});
