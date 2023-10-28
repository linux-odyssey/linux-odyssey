// ***********************************************
// This example commands.js shows you how to
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
import '@testing-library/cypress/add-commands'

Cypress.Commands.add('LoginWithPassword', (username, password) => {
  cy.clearAllCookies({ domain: null })
  cy.get('a.text-text-primary').should('contain', 'Log in').click()
  cy.get('#username').type(username)
  cy.get('#password').type(password)
  cy.findByRole('button', { name: 'Log in' }).click()
})
Cypress.Commands.add('typeInCommand', (command) => {
  cy.get('.xterm-screen').type(command)
})
Cypress.Commands.add('getQuestInfo', (id) => {
  return cy.get('#quest').find('p.text-text').contains(`${id}`)
})
Cypress.Commands.add('getTaskCheckbox', (id) => {
  return cy.getQuestInfo(id).findByRole('checkbox')
})
