/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add(
    'login',
    (username: string = Cypress.env('username'), password: string = Cypress.env('password')) => {
        cy.visit('/');
        cy.intercept('GET', '**/todos').as('login_command');
        cy.get('input#email').invoke('val').should('match', new RegExp(username, 'i'));
        cy.get('input#password').type(password, { log: false });
        cy.get('#sign-in-button-manual').click();
        cy.wait('@login_command');
    }
)