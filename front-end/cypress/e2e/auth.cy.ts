/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

describe('Tests fonctionnels Authentification et Utilisateur', () => {
    const validEmail = 'user@example.com';
    const validPassword = 'Hola123';
    const invalidEmail = 'fake@example.com';
    const invalidPassword = 'mauvaismotdepasse';

    it('F01 - Authentification valide', () => {
        cy.visit('/login');
        cy.get('input#email').type(validEmail);
        cy.get('input#password').type(validPassword);
        cy.get('button[type="submit"]').click();
        cy.contains('Bienvenue').should('exist');
    });

    it('F02 - Authentification invalide', () => {
        cy.visit('/login');
        cy.get('input#email').type(invalidEmail);
        cy.get('input#password').type(invalidPassword);
        cy.get('button[type="submit"]').click();
        cy.contains('Erreur de connexion').should('exist');
    });

    it('F03 - Déconnexion', () => {
        // Connexion préalable
        cy.visit('/login');
        cy.get('input#email').type(validEmail);
        cy.get('input#password').type(validPassword);
        cy.get('button[type="submit"]').click();
        cy.visit('/profile');
        cy.contains('Se déconnecter').click();
        cy.url().should('include', '/login');
    });

    it('F04 - Inscription nouvel utilisateur', () => {
        const random = Math.floor(Math.random() * 100000);
        const email = `testuser${random}@exemple.com`;
        cy.visit('/register');
        cy.get('input#firstName').type('Test');
        cy.get('input#lastName').type('User');
        cy.get('input#email').type(email);
        cy.get('input#password').type('motdepasse');
        cy.get('input#confirmPassword').type('motdepasse');
        cy.get('button[type="submit"]').click();
        cy.contains('connexion', { matchCase: false }).should('exist');
    });

    it('F05 - Modification mot de passe utilisateur', () => {
        // Connexion préalable
        cy.visit('/login');
        cy.get('input#email').type(validEmail);
        cy.get('input#password').type(validPassword);
        cy.get('button[type="submit"]').click();
        cy.visit('/profile');
        cy.get('input#currentPassword').type(validPassword);
        cy.get('input#newPassword').type('nouveaumotdepasse');
        cy.contains('Modifier le mot de passe').click();
        cy.contains('mot de passe a été modifié', { matchCase: false }).should('exist');
        // (optionnel) Remettre l'ancien mot de passe pour les tests suivants
    });
});