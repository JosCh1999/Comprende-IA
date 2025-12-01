const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../App');
const User = require('../model/usuario');
const Attempt = require('../model/attempt');
const Text = require('../model/text');
const jwt = require('jsonwebtoken');

let server;
let studentToken;
let studentId;

beforeAll(async () => {
    // Usamos una URI única para evitar colisiones en tests paralelos
    const mongoUri = 'mongodb://localhost:27017/testdb_student_' + Date.now();
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    }
    server = app.listen();

    await User.deleteMany({});
    await Attempt.deleteMany({});
    await Text.deleteMany({});

    // Crear usuario estudiante
    const student = await new User({
        nombre: 'Student Test',
        correo: 'student@test.com',
        contraseña: 'password123',
        role: 'student'
    }).save();
    studentId = student._id;
    studentToken = jwt.sign({ id: studentId, role: 'student' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
});

afterAll(async () => {
    await mongoose.connection.close();
    await new Promise(resolve => server.close(resolve));
});

describe('Student API', () => {

    it('GET /student/progress - debería devolver el progreso del estudiante', async () => {
        // Crear un intento previo
        const text = await new Text({
            filename: 'test.txt',
            content: 'Contenido de prueba',
            owner: studentId
        }).save();

        await new Attempt({
            userId: studentId,
            textId: text._id,
            totalScore: 80,
            answers: []
        }).save();

        const response = await request(app)
            .get('/student/progress')
            .set('Authorization', `Bearer ${studentToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Progreso obtenido exitosamente.');
        expect(response.body.progress).toHaveProperty('totalAttempts', 1);
        expect(response.body.progress).toHaveProperty('averageScore', 80);
    });

    it('GET /student/recommendations - debería devolver recomendaciones vacías si no hay', async () => {
        const response = await request(app)
            .get('/student/recommendations')
            .set('Authorization', `Bearer ${studentToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Recomendaciones obtenidas exitosamente.');
        expect(response.body.recommendations).toEqual([]);
    });

    it('GET /student/progress - debería fallar sin token (401)', async () => {
        const response = await request(app)
            .get('/student/progress');

        expect(response.statusCode).toBe(401);
    });

});
