// cypress/e2e/upload.cy.js
import { faker } from '@faker-js/faker';

describe('Upload', function() {

    it('Upload', function() {

        // =========================================
        // 1. GENERAR ARCHIVO ÚNICO
        // =========================================
        const fileName = `archivo-${faker.string.alphanumeric(10)}.txt`;
        const filePath = `cypress/fixtures/${fileName}`;
        const contenido = `Contenido único generado: ${faker.lorem.sentence()}`;

        cy.writeFile(filePath, contenido); // crea el archivo dinámico

        // =========================================
        // 2. LOGIN
        // =========================================
        cy.visit('http://localhost:5173/login');

        cy.get('[name="correo"]').type('kguerra@gmail.com');
        cy.get('[name="contraseña"]').type('123456789{enter}');

        // Espera la redirección al dashboard del estudiante
        cy.url({ timeout: 15000 }).should('include', '/student/dashboard');

        // =========================================
        // 3. CLICK EN SUBIR ARCHIVO
        // =========================================
        cy.contains('a', 'Subir Archivo', { timeout: 15000 }).click();

        // =========================================
        // 4. SELECCIONAR ARCHIVO DINÁMICO
        // =========================================
        cy.get('[name="file-upload"]', { timeout: 15000 })
            .selectFile(filePath);

        // =========================================
        // 5. BOTÓN SUBIR
        // =========================================
        cy.contains('button', 'Subir y Analizar', { timeout: 15000 }).click();

        // =========================================
        // 6. CONFIRMACIÓN FINAL
        // =========================================
        cy.contains('¡Análisis completado con éxito!', { timeout: 20000 })
            .should('exist');
    });

});

