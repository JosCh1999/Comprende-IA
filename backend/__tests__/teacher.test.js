const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../App');
const User = require('../model/usuario');
const Enrollment = require('../model/enrollment');
const Text = require('../model/text');
const jwt = require('jsonwebtoken');

let server;
let teacherToken;
let teacherId;
let studentId;

beforeAll(async () => {
    const mongoUri = 'mongodb://localhost:27017/testdb_teacher_' + Date.now();
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    }
    server = app.listen();

    await User.deleteMany({});
    await Enrollment.deleteMany({});
    await Text.deleteMany({});

    // Crear profesor
    const teacher = await new User({
        nombre: 'Teacher Test',
        correo: 'teacher@test.com',
        contraseña: 'password123',
        role: 'teacher'
    }).save();
    teacherId = teacher._id;
    teacherToken = jwt.sign({ id: teacherId, role: 'teacher' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    // Crear estudiante
    const student = await new User({
        nombre: 'Student For Teacher',
        correo: 'student_t@test.com',
        contraseña: 'password123',
        role: 'student'
    }).save();
    studentId = student._id;
});

afterAll(async () => {
    await mongoose.connection.close();
    await new Promise(resolve => server.close(resolve));
});

describe('Teacher API', () => {

    it('POST /teacher/students/enroll - debería enrolar un estudiante', async () => {
        const response = await request(app)
            .post('/teacher/students/enroll')
            .set('Authorization', `Bearer ${teacherToken}`)
            .send({ studentEmail: 'student_t@test.com' });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('message', 'Estudiante enrolado exitosamente.');
        expect(response.body.enrollment).toHaveProperty('teacher', teacherId.toString());
        expect(response.body.enrollment).toHaveProperty('student', studentId.toString());
    });

    it('GET /teacher/students - debería listar estudiantes enrolados', async () => {
        const response = await request(app)
            .get('/teacher/students')
            .set('Authorization', `Bearer ${teacherToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.students).toHaveLength(1);
        expect(response.body.students[0]).toHaveProperty('correo', 'student_t@test.com');
    });

    it('POST /teacher/students/:id/recommend - debería recomendar un texto', async () => {
        // Crear un texto primero
        const text = await new Text({
            filename: 'lectura.pdf',
            content: 'Contenido...',
            owner: studentId
        }).save();

        const response = await request(app)
            .post(`/teacher/students/${studentId}/recommend`)
            .set('Authorization', `Bearer ${teacherToken}`)
            .send({
                textId: text._id,
                comment: 'Leer esto',
                type: 'recommendation'
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('message', 'Texto recomendado exitosamente.');
    });

    it('POST /teacher/students/enroll - debería fallar si el email no existe (404)', async () => {
        const response = await request(app)
            .post('/teacher/students/enroll')
            .set('Authorization', `Bearer ${teacherToken}`)
            .send({ studentEmail: 'noexiste@test.com' });

        expect(response.statusCode).toBe(404);
    });

});
