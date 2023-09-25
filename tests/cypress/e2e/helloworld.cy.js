/// <reference types="cypress" />
describe('example helloworld app', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173')
  })

  it('open login page', () => {
    cy.get('#username').type('alex')
    cy.get('#password').type('123456{enter}')
  })
})
