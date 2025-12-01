const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../App');
const User = require('../model/usuario');
const Text = require('../model/text');
const Pregunta = require('../model/pregunta');
const jwt = require('jsonwebtoken');

// Mock services
jest.mock('../services/aiService', () => ({
    generateQuestions: jest.fn(),
    detectFallacies: jest.fn()
}));

jest.mock('../services/teacherService', () => ({
    getStudentRecommendations: jest.fn(),
    getTextRecommendation: jest.fn(),
    enrollStudent: jest.fn(),
    getEnrolledStudents: jest.fn(),
    getStudentProgress: jest.fn(),
    recommendText: jest.fn(),
    getStudentTexts: jest.fn(),
    getAttemptDetail: jest.fn(),
    getTextForDownload: jest.fn()
}));

const aiService = require('../services/aiService');
const teacherService = require('../services/teacherService');

let server;
let token;
let userId;
let textId;

beforeAll(async () => {
    const mongoUri = 'mongodb://localhost:27017/testdb_coverage_' + Date.now();
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    }
    server = app.listen();

    await User.deleteMany({});
    await Text.deleteMany({});
    await Pregunta.deleteMany({});

    const user = await new User({
        nombre: 'Coverage User',
        correo: 'coverage@test.com',
        contraseña: 'password123',
        role: 'teacher'
    }).save();
    userId = user._id;
    token = jwt.sign({ id: userId, role: 'teacher' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    const text = await new Text({
        filename: 'coverage_text.txt',
        content: 'Contenido para coverage',
        owner: userId
    }).save();
    textId = text._id;
});

afterAll(async () => {
    await mongoose.connection.close();
    await new Promise(resolve => server.close(resolve));
});

describe('Coverage Tests - AI Controller Error Handling', () => {

    it('POST /ai/generate-questions/:textId - debería manejar error del servicio (500)', async () => {
        aiService.generateQuestions.mockRejectedValue(new Error('Service Error'));

        const response = await request(app)
            .post(`/ai/generate-questions/${textId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message', 'Error interno del servidor al generar preguntas.');
    });

    it('POST /ai/detect-fallacies/:textId - debería manejar error del servicio (500)', async () => {
        aiService.detectFallacies.mockRejectedValue(new Error('Service Error'));

        const response = await request(app)
            .post(`/ai/detect-fallacies/${textId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message', 'Error interno del servidor al detectar falacias.');
    });

    it('GET /ai/export-questions/:textId/csv - debería devolver 404 si no hay preguntas', async () => {
        // Asegurarse de que no haya preguntas
        await Pregunta.deleteMany({ textId });

        const response = await request(app)
            .get(`/ai/export-questions/${textId}/csv`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('message', 'No se encontraron preguntas para este texto. Genérelas primero.');
    });

});

describe('Coverage Tests - Text Controller Error Handling', () => {

    it('GET /textos/:id - debería devolver 400 si el ID es inválido', async () => {
        // Mock service to throw CastError
        const textService = require('../services/textService');
        jest.spyOn(textService, 'getTextByIdAndOwner').mockRejectedValue({ kind: 'ObjectId' });

        const response = await request(app)
            .get('/textos/invalid-id')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message', 'El ID del texto no es válido.');

        jest.restoreAllMocks();
    });

    it('GET /textos/:id - debería devolver 404 si el texto no existe', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const response = await request(app)
            .get(`/textos/${fakeId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(404);
    });

});

describe('Coverage Tests - Attempt Controller Error Handling', () => {
    const attemptService = require('../services/attemptService');

    it('POST /attempts - debería manejar error del servicio (500)', async () => {
        jest.spyOn(attemptService, 'createAttempt').mockRejectedValue(new Error('Service Error'));

        const response = await request(app)
            .post('/attempts')
            .set('Authorization', `Bearer ${token}`)
            .send({ textId: textId, answers: [1, 2] });

        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message', 'Error interno del servidor al procesar el intento.');

        jest.restoreAllMocks();
    });

    it('POST /attempts - debería devolver 400 si faltan datos', async () => {
        const response = await request(app)
            .post('/attempts')
            .set('Authorization', `Bearer ${token}`)
            .send({}); // Empty body

        expect(response.statusCode).toBe(400);
    });
});

describe('Coverage Tests - Middleware', () => {
    it('should return 401 if no token provided', async () => {
        const response = await request(app)
            .get(`/textos/${textId}`); // No auth header

        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('mensaje', 'Acceso denegado. Token no proporcionado o con formato incorrecto.');
    });

    it('should return 401 if token is malformed', async () => {
        const response = await request(app)
            .get(`/textos/${textId}`)
            .set('Authorization', 'Bearer '); // Empty token

        expect(response.statusCode).toBe(401);
    });

    it('should return 401 if token is invalid', async () => {
        const response = await request(app)
            .get(`/textos/${textId}`)
            .set('Authorization', 'Bearer invalidtoken');

        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('mensaje', 'Token inválido o expirado.');
    });
});

describe('Coverage Tests - Auth Controller Error Handling', () => {

    it('POST /auth/register - debería devolver 400 si faltan datos', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({});

        expect(response.statusCode).toBe(400);
    });

    it('POST /auth/login - debería devolver 401 si faltan datos (o credenciales incorrectas)', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({});

        expect(response.statusCode).toBe(401);
    });

    it('POST /auth/login - debería devolver 401 si el usuario no existe', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({ correo: 'nonexistent@test.com', contraseña: 'password' });

        expect(response.statusCode).toBe(401);
    });

});

/*
describe('Coverage Tests - Student Controller Error Handling', () => {

    it('GET /student/recommendations - debería manejar error del servicio (500)', async () => {
        teacherService.getStudentRecommendations.mockRejectedValue(new Error('Service Error'));

        const response = await request(app)
            .get('/student/recommendations')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(500);
    });

    it('GET /student/recommendations/:textId - debería manejar error del servicio (500)', async () => {
        teacherService.getTextRecommendation.mockRejectedValue(new Error('Service Error'));

        const response = await request(app)
            .get(`/student/recommendations/${textId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(500);
    });
});
*/

describe('Coverage Tests - Teacher Controller Error Handling', () => {

    it('POST /teacher/students/enroll - debería devolver 400 si falta email', async () => {
        const response = await request(app)
            .post('/teacher/students/enroll')
            .set('Authorization', `Bearer ${token}`)
            .send({});

        expect(response.statusCode).toBe(400);
    });

    it('POST /teacher/students/enroll - debería manejar error del servicio (500)', async () => {
        teacherService.enrollStudent.mockRejectedValue(new Error('Service Error'));

        const response = await request(app)
            .post('/teacher/students/enroll')
            .set('Authorization', `Bearer ${token}`)
            .send({ studentEmail: 'student@test.com' });

        expect(response.statusCode).toBe(500);
    });

    it('GET /teacher/students - debería manejar error del servicio (500)', async () => {
        teacherService.getEnrolledStudents.mockRejectedValue(new Error('Service Error'));

        const response = await request(app)
            .get('/teacher/students')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(500);
    });

    it('POST /teacher/students/:studentId/recommend - debería devolver 400 si falta textId', async () => {
        const response = await request(app)
            .post(`/teacher/students/${userId}/recommend`)
            .set('Authorization', `Bearer ${token}`)
            .send({});

        expect(response.statusCode).toBe(400);
    });
});
