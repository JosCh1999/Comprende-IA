const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../App');
const User = require('../model/usuario');
const Text = require('../model/text');
const Attempt = require('../model/attempt');
const jwt = require('jsonwebtoken');

// Mock de notificación para no llamar a n8n real
jest.mock('../services/notificationService', () => ({
    sendAttemptNotification: jest.fn().mockResolvedValue(true)
}));

let server;
let token;
let userId;
let textId;

beforeAll(async () => {
    const mongoUri = 'mongodb://localhost:27017/testdb_attempt_' + Date.now();
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    }
    server = app.listen();

    await User.deleteMany({});
    await Text.deleteMany({});
    await Attempt.deleteMany({});

    const user = await new User({
        nombre: 'Attempt User',
        correo: 'attempt@test.com',
        contraseña: 'password123',
        role: 'student'
    }).save();
    userId = user._id;
    token = jwt.sign({ id: userId, role: 'student' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    const text = await new Text({
        filename: 'attempt_text.txt',
        content: 'Contenido intento',
        owner: userId
    }).save();
    textId = text._id;
});

afterAll(async () => {
    await mongoose.connection.close();
    await new Promise(resolve => server.close(resolve));
});

describe('Attempt API', () => {

    it('POST /attempts - debería crear un intento', async () => {
        const response = await request(app)
            .post('/attempts')
            .set('Authorization', `Bearer ${token}`)
            .send({
                textId: textId,
                answers: [
                    {
                        preguntaId: new mongoose.Types.ObjectId(),
                        questionText: '¿Qué pasó?',
                        userAnswer: 'Respuesta 1'
                    }
                ]
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('message', 'Intento evaluado y guardado correctamente.');
        expect(response.body.attempt).toHaveProperty('totalScore');
    });



    it('POST /attempts - debería fallar si faltan datos (400)', async () => {
        const response = await request(app)
            .post('/attempts')
            .set('Authorization', `Bearer ${token}`)
            .send({ textId: textId }); // Faltan answers

        expect(response.statusCode).toBe(400);
    });

    it('GET /attempts/history/:textId - debería devolver 404 si no hay intento', async () => {
        const newText = await new Text({ filename: 'new.txt', content: '...', owner: userId }).save();

        const response = await request(app)
            .get(`/attempts/history/${newText._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(404);
    });

});
