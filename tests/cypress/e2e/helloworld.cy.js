/// <reference types="cypress" />
describe('example helloworld app', () => {
  describe('Login tests', () => {
    beforeEach(() => {
      cy.visit('/')
    })
    it('Check Login Page Elements-Register', () => {
      cy.get('h1.text-text-primary')
        .should('contain', 'Linux Odyssey')
        .and('be.visible')
      cy.get('label[for="username"]')
        .should('contain', 'Username')
        .and('be.visible')
      cy.get('#username')
        .invoke('attr', 'placeholder')
        .should('contain', 'Enter your username')
      cy.get('label.text-text-secondary')
        .should(
          'contain',
          `Username should start with lowercase and consist of lowercase, numbers, '_' and '-'`
        )
        .and('be.visible')
      cy.get('label[for="email"]').should('contain', 'Email').and('be.visible')
      cy.get('#email')
        .invoke('attr', 'placeholder')
        .should('contain', 'Enter your email')
      cy.get('label[for="password"]')
        .should('contain', 'Password')
        .and('be.visible')
      cy.get('#password')
        .invoke('attr', 'placeholder')
        .should('contain', 'Enter your password')
      cy.findByRole('button', { name: 'Register' }).should('be.visible')
      cy.get('span').contains('Already have an account?').should('be.visible')
    })
    it('Check social account UI', () => {
      cy.get('p').contains('Log in with social account').should('be.visible')
      cy.findByRole('link', { name: 'Google' }).should('be.visible')
      cy.findByRole('link', { name: 'GitHub' }).should('be.visible')
    })
    it('Login-Already Register', () => {
      cy.get('a.text-text-primary').should('contain', 'Log in').click()
      cy.get('#username').type('alex')
      cy.get('#password').type('123456')
      cy.findByRole('button', { name: 'Log in' }).click()
    })
  })
  describe('Hello world', () => {
    beforeEach(() => {
      cy.visit('/')
      cy.Login()
      cy.get('.xterm-screen').as('Terminaltextbox')
      cy.findByRole('button', { name: 'Reset' }).click()
      cy.get('@Terminaltextbox').should('contain', 'commander')
    })

    it('Typing in Terminal', () => {
      cy.get('@Terminaltextbox').type('12345{enter}')
      cy.get('@Terminaltextbox').should(
        'contain',
        'zsh: command not found: 12345'
      )
    })
    it('Clear first task', () => {
      cy.get('@Terminaltextbox').type('echo Hello World!{enter}')
      // cy.wait(5000)
      cy.get('@Terminaltextbox').should('contain', '你聽到了一個聲音：')
    })
  })
})
