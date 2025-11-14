

it('Login Test', function() {
    cy.visit('http://localhost:5173/login')
    cy.get('[name="correo"]').click();
    cy.get('[name="correo"]').type('kguerra@gmail.com');
    cy.get('[name="contraseña"]').click();
    cy.get('[name="contraseña"]').click();
    cy.get('[name="contraseña"]').type('123456789');
    cy.get('#root button.w-full').click();
    cy.get('#root p.mt-1').click();
    cy.get('#root p.mt-1').should('have.text', 'Bienvenido a tu centro de control de aprendizaje.');
    
});