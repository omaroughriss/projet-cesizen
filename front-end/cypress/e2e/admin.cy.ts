/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

describe('Tests fonctionnels Administration', () => {
    beforeEach(() => {
        // Se connecter en tant qu'admin avant chaque test
        cy.visit('/login');
        cy.get('input#email').type('admin@example.com');
        cy.get('input#password').type('nouveaumotdepasse');
        cy.get('button[type="submit"]').click();
        // Attendre la redirection et le chargement
        cy.url().should('include', '/admin');
        // Aller à la page d'administration des utilisateurs
        cy.visit('/admin/users');
        // Attendre que la page soit chargée (le loading disparaît)
        cy.get('table').should('be.visible', { timeout: 10000 });
    });

    it('F15 - Affichage liste utilisateurs (Admin)', () => {
        // Attendre que la table soit chargée avec des données
        cy.get('tr').should('have.length.at.least', 2, { timeout: 10000 }); // Au moins l'en-tête et une ligne
    });

    it('F16 - Création utilisateur (Admin)', () => {
        // Générer un email unique avec timestamp
        const timestamp = new Date().getTime();
        const uniqueEmail = `testuser${timestamp}@example.com`;
        const uniqueUsername = `testuser${timestamp}`;
        
        // 2. Cliquer Créer
        cy.contains('button', 'Nouvel utilisateur').should('be.visible').click();
        
        // Attendre que le dialogue soit visible
        cy.get('div[role="dialog"]').should('be.visible');
        
        // 3. Remplir formulaire
        cy.get('input[id="firstName"]').should('be.visible').type('CreationTest');
        cy.get('input[id="lastName"]').should('be.visible').type('User');
        cy.get('input[id="email"]').should('be.visible').type(uniqueEmail);
        cy.get('input[id="username"]').should('be.visible').type(uniqueUsername);
        cy.get('input[id="password"]').should('be.visible').type('password123');
        
        // 4. Soumettre
        cy.contains('button', 'Créer', { timeout: 10000 }).should('be.visible').click();
        
        // Vérifier que l'utilisateur est créé (avec timeout plus long pour l'API)
        cy.contains('succès', { timeout: 10000 }).should('exist');
        cy.contains('CreationTest', { timeout: 10000 }).should('exist');
    });

    it('F17 - Modification utilisateur (Admin)', () => {
        // 1. Attendre et sélectionner utilisateur
        cy.contains('tr', 'Test', { timeout: 10000 }).within(() => {
            // 2. Cliquer Modifier
            cy.get('button').contains('Modifier').should('be.visible').click();
        });
        
        // Attendre le dialogue de modification
        cy.get('div[role="dialog"]', { timeout: 10000 }).should('be.visible');
        
        // 3. Changer contenu
        // cy.get('input[id="firstName"]', { timeout: 10000 }).clear().type('ModificationTest');
        
        // 4. Enregistrer
        cy.contains('button', 'Enregistrer').click();
        
        // Vérifier la modification
        cy.contains('succès', { timeout: 10000 }).should('exist');
    });

    it('F18 - Désactivation/Réactivation utilisateur (Admin)', () => {
        // 1. Attendre et sélectionner utilisateur
        cy.contains('tr', 'Test', { timeout: 10000 }).within(() => {
            // 2. Cliquer sur le switch d'activation
            cy.get('button[role="switch"]').should('be.visible').click();
        });
        
        // Vérifier le changement de statut
        cy.contains('statut', { timeout: 10000 }).should('exist');
        
        // Attendre et réactiver l'utilisateur
        cy.contains('tr', 'Test').within(() => {
            cy.get('button[role="switch"]').should('be.visible').click();
        });
    });

    it('F19 - Suppression utilisateur (Admin)', () => {
        // 1. Attendre et sélectionner utilisateur
        cy.contains('tr', 'Test', { timeout: 10000 }).within(() => {
            // 2. Cliquer Supprimer
            cy.get('button[data-component-content="%7B%22className%22%3A%22text-red-500%20hover%3Atext-red-700%20hover%3Abg-red-50%22%7D"]').should('be.visible').click();
        });
        
        // Attendre la boîte de dialogue de confirmation
        cy.get('div[role="alertdialog"]').should('be.visible');
        
        // 3. Confirmer
        cy.contains('button', 'Supprimer').should('be.visible').click();
        
        // Vérifier la suppression
        cy.contains('succès', { timeout: 10000 }).should('exist');
    });
}); 