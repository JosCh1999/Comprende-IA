const mongoose = require('mongoose');
const attemptService = require('../services/attemptService');
const textService = require('../services/textService');
const authService = require('../services/authService');
const Attempt = require('../model/attempt');
const Text = require('../model/text');
const Usuario = require('../model/usuario');

// Mock dependencies
jest.mock('../services/aiService', () => ({
    evaluateAnswer: jest.fn(),
    analyzeTextWithAI: jest.fn()
}));
const aiService = require('../services/aiService');

jest.mock('../model/attempt');
jest.mock('../model/text');
jest.mock('../model/usuario');

describe('Services Coverage Tests', () => {

    describe('Attempt Service', () => {
        it('createAttempt - should throw error if data is missing', async () => {
            await expect(attemptService.createAttempt(null, 'textId', [])).rejects.toThrow('Faltan datos obligatorios');
        });

        it('createAttempt - should handle AI evaluation error', async () => {
            aiService.evaluateAnswer.mockRejectedValue(new Error('AI Error'));
            Attempt.prototype.save = jest.fn().mockResolvedValue({ _id: 'attemptId' });

            const answers = [{ preguntaId: 'p1', questionText: 'q1', userAnswer: 'a1' }];
            const result = await attemptService.createAttempt('userId', 'textId', answers);

            expect(result).toBeDefined();
            expect(Attempt).toHaveBeenCalled();
            // Verify that the answer was processed with error feedback
            const savedAttempt = Attempt.mock.instances[0];
            // Since we mocked the constructor, we can't easily check the passed data unless we inspect calls
            expect(Attempt).toHaveBeenCalledWith(expect.objectContaining({
                answers: expect.arrayContaining([
                    expect.objectContaining({ feedback: 'Error al procesar la evaluación de esta respuesta.' })
                ])
            }));
        });
    });

    describe('Text Service', () => {
        it('createText - should throw error if data is missing', async () => {
            await expect(textService.createText(null, null, null)).rejects.toThrow('Faltan datos obligatorios');
        });

        it('createText - should handle duplicate text', async () => {
            Text.findOne.mockResolvedValue({ _id: 'existingId' });
            await expect(textService.createText('file.txt', 'content', 'userId')).rejects.toThrow('Este texto ya ha sido analizado previamente.');
        });

        it('createText - should handle AI analysis error gracefully', async () => {
            Text.findOne.mockResolvedValue(null);
            aiService.analyzeTextWithAI.mockRejectedValue(new Error('AI Error'));
            Text.prototype.save = jest.fn().mockResolvedValue({ _id: 'textId', analysis: null });

            const result = await textService.createText('file.txt', 'content', 'userId');
            expect(result).toBeDefined();
            // Analysis should be null
            expect(Text).toHaveBeenCalledWith(expect.objectContaining({ analysis: null }));
        });
    });

    describe('Auth Service', () => {
        it('registerUser - should throw error if data is missing', async () => {
            await expect(authService.registerUser({})).rejects.toThrow('Faltan datos');
        });

        it('registerUser - should throw error if email exists', async () => {
            Usuario.findOne.mockResolvedValue({ _id: 'existingUser' });
            await expect(authService.registerUser({ nombre: 'n', email: 'e', password: 'p' })).rejects.toThrow('El email ya está registrado');
        });
    });

    describe('Teacher Service', () => {
        const teacherService = require('../services/teacherService');
        const Enrollment = require('../model/enrollment');
        const TextRecommendation = require('../model/textRecommendation');

        jest.mock('../model/enrollment');
        jest.mock('../model/textRecommendation');

        it('enrollStudent - should throw error if student not found', async () => {
            Usuario.findOne.mockResolvedValue(null);
            await expect(teacherService.enrollStudent('teacherId', 'email')).rejects.toThrow('No se encontró un estudiante con ese email.');
        });

        it('enrollStudent - should throw error if already enrolled and active', async () => {
            Usuario.findOne.mockResolvedValue({ _id: 'studentId' });
            Enrollment.findOne.mockResolvedValue({ isActive: true });
            await expect(teacherService.enrollStudent('teacherId', 'email')).rejects.toThrow('Este estudiante ya está enrolado en tu clase.');
        });

        it('enrollStudent - should reactivate enrollment if inactive', async () => {
            Usuario.findOne.mockResolvedValue({ _id: 'studentId' });
            const mockEnrollment = { isActive: false, save: jest.fn() };
            Enrollment.findOne.mockResolvedValue(mockEnrollment);

            await teacherService.enrollStudent('teacherId', 'email');
            expect(mockEnrollment.isActive).toBe(true);
            expect(mockEnrollment.save).toHaveBeenCalled();
        });

        it('getStudentProgress - should throw error if not enrolled', async () => {
            Enrollment.findOne.mockResolvedValue(null);
            await expect(teacherService.getStudentProgress('teacherId', 'studentId')).rejects.toThrow('Este estudiante no está enrolado en tu clase.');
        });

        it('recommendText - should throw error if text not found', async () => {
            Enrollment.findOne.mockResolvedValue({ isActive: true });
            Text.findById.mockResolvedValue(null);
            await expect(teacherService.recommendText('teacherId', 'studentId', 'textId')).rejects.toThrow('El texto no existe.');
        });

        it('getStudentTexts - should throw error if not enrolled', async () => {
            Enrollment.findOne.mockResolvedValue(null);
            await expect(teacherService.getStudentTexts('teacherId', 'studentId')).rejects.toThrow('Este estudiante no está enrolado en tu clase.');
        });

        it('getAttemptDetail - should throw error if attempt not found', async () => {
            Attempt.findById.mockReturnValue({ populate: jest.fn().mockReturnThis() });
            // Mock findById to return null eventually or mock the chain
            // Since we mocked Attempt, we need to mock the chain properly
            const mockPopulate = jest.fn().mockReturnThis();
            Attempt.findById.mockReturnValue({ populate: mockPopulate });
            // Wait, if findById returns the query object, we need to await it.
            // But here we are mocking the model method.
            // If we want it to resolve to null:
            Attempt.findById.mockResolvedValue(null);
            // But wait, the code uses .populate().
            // So findById must return an object with populate method that resolves.
            // Attempt.findById(id).populate(...)
            const mockQuery = { populate: jest.fn().mockReturnThis(), then: jest.fn().mockResolvedValue(null) };
            // Actually, mongoose queries are thenables.
            // Easier:
            Attempt.findById.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                then: (cb) => cb(null) // Resolve to null
            });

            // Re-mock Attempt properly for this test
            Attempt.findById = jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                then: (resolve) => resolve(null)
            });

            await expect(teacherService.getAttemptDetail('teacherId', 'attemptId')).rejects.toThrow('Intento no encontrado.');
        });

        it('getTextForDownload - should throw error if text not found', async () => {
            Text.findById.mockResolvedValue(null);
            await expect(teacherService.getTextForDownload('teacherId', 'textId')).rejects.toThrow('Texto no encontrado.');
        });

        it('getTeacherRecommendations - should return recommendations', async () => {
            TextRecommendation.find.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockResolvedValue([
                    {
                        _id: 'recId',
                        student: { nombre: 'S', correo: 's@s.com' },
                        text: { filename: 'f.txt' },
                        comment: 'c',
                        status: 'pending',
                        createdAt: new Date(),
                        completedAt: null
                    }
                ])
            });

            const result = await teacherService.getTeacherRecommendations('teacherId');
            expect(result).toHaveLength(1);
            expect(result[0].studentName).toBe('S');
        });
    });

});
