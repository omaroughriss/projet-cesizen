/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

describe('Tests fonctionnels Navigation et Questionnaire', () => {
    beforeEach(() => {
        // Se connecter avant chaque test car ces fonctionnalités nécessitent une authentification
        cy.visit('/login');
        cy.get('input#email').type('user@example.com');
        cy.get('input#password').type('Hola123');
        cy.get('button[type="submit"]').click();
    });

    it('F06 - Navigation pages principales', () => {
        // Test Accueil
        cy.visit('/');
        cy.contains('Bienvenue').should('exist');

        // Test Articles
        cy.visit('/articles');
        cy.url().should('include', '/articles');

        // Test Questionnaire
        cy.visit('/questionnaire');
        cy.url().should('include', '/questionnaire');

        // Test Profil
        cy.visit('/profile');
        cy.url().should('include', '/profile');
    });

    it('F07 - URL inconnue', () => {
        cy.visit('/page-inexistante', { failOnStatusCode: false });
        cy.contains('404').should('exist');
        cy.contains('Page not found', { matchCase: false }).should('exist');
    });

    it('F08 - Affichage liste d\'articles', () => {
        cy.visit('/articles');
        // Vérifie que la liste des articles est affichée
        cy.contains('Infos sur la santé mentale').should('exist');
    });

    it('F09 - Chargement questionnaire', () => {
        cy.visit('/questionnaire');
        // Vérifie que les questions sont affichées
        cy.contains('Évalue ton niveau de stress').should('exist');
        cy.contains('pts').should('exist');
    });

    it('F10 - Sélection réponses questionnaire', () => {
        cy.visit('/questionnaire');
        // Sélectionne quelques réponses en utilisant les checkboxes
        cy.get('input[type="checkbox"]').first().click();
        cy.get('input[type="checkbox"]').eq(1).click();
        // Vérifie que les réponses sont sélectionnées
        cy.get('input[type="checkbox"]:checked').should('have.length.at.least', 2);
    });

    it('F11 - Calcul score questionnaire', () => {
        cy.visit('/questionnaire');
        // Sélectionne toutes les réponses nécessaires
        cy.get('input[type="checkbox"]').each(($checkbox) => {
            cy.wrap($checkbox).click();
        });
        // Soumet le questionnaire
        cy.contains('button', 'Calculer mon niveau de stress').click();
        // Vérifie que le score est calculé et affiché
        cy.contains('points').should('exist');
        cy.contains('Niveau de stress').should('exist');
    });
}); 