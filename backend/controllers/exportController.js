const ExcelJS = require('exceljs');
const teacherService = require('../services/teacherService');
const Usuario = require('../model/usuario');

/**
 * Exportar progreso de estudiante a Excel
 * GET /teacher/students/:studentId/export/excel
 */
const exportStudentProgressToExcel = async (req, res) => {
    try {
        const teacherId = req.userId;
        const { studentId } = req.params;

        // 1. Obtener datos del estudiante y su progreso
        const student = await Usuario.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Estudiante no encontrado.' });
        }

        const progress = await teacherService.getStudentProgress(teacherId, studentId);

        // 2. Crear libro de Excel
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Comprende-IA';
        workbook.created = new Date();

        const worksheet = workbook.addWorksheet('Progreso');

        // 3. Configurar columnas
        worksheet.columns = [
            { header: 'Fecha', key: 'date', width: 15 },
            { header: 'Texto', key: 'text', width: 30 },
            { header: 'Puntuación', key: 'score', width: 12 },
            { header: 'Respuestas', key: 'answers', width: 12 },
            { header: 'Nivel', key: 'level', width: 15 }
        ];

        // Estilo de cabecera
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
        };

        // 4. Agregar filas de datos
        progress.attempts.forEach(att => {
            let level = 'Básico';
            if (att.score >= 80) level = 'Avanzado';
            else if (att.score >= 60) level = 'Intermedio';

            worksheet.addRow({
                date: new Date(att.completedAt).toLocaleDateString(),
                text: att.textFilename || 'Texto eliminado',
                score: att.score,
                answers: att.answersCount,
                level: level
            });
        });

        // 5. Agregar resumen al final
        worksheet.addRow([]); // Fila vacía
        worksheet.addRow(['Resumen General']).font = { bold: true };
        worksheet.addRow(['Total Intentos', progress.totalAttempts]);
        worksheet.addRow(['Promedio', progress.averageScore]);
        worksheet.addRow(['Textos Completados', progress.textsCompleted]);

        // 6. Configurar respuesta HTTP
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=progreso_${student.nombre.replace(/\s+/g, '_')}.xlsx`);

        // 7. Enviar archivo
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error('Error al exportar a Excel:', error);
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error interno del servidor al exportar.' });
    }
};

module.exports = {
    exportStudentProgressToExcel
};
