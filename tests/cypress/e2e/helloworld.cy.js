/// <reference types="cypress" />
describe('example helloworld app', () => {
  it('open login page', () => {
    console.log('baseUrl', Cypress.config('baseUrl'))
    cy.visit('/register')
    cy.get('#username').type('alex')
    cy.get('#email').type('alex@gmail.com')
    cy.get('#password').type('123456As{enter}')
  })
})
