/// <reference types="cypress" />
describe('example helloworld app', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('open login page', () => {
    cy.get('#username').type('alex')
    cy.get('#password').type('123456{enter}')
  })
})
