import '@testing-library/cypress/add-commands'

Cypress.Commands.add('LoginWithPassword', (username, password) => {
  cy.clearAllCookies({ domain: null })
  cy.get('a.text-text-primary', { timeout: 100000 }).contains('Log in').click()
  cy.get('#username').type(username)
  cy.get('#password').type(password)
  cy.findByRole('button', { name: 'Log In' }).click()
})
Cypress.Commands.add('PrepareForGame', () => {
  cy.visit('/')
  cy.LoginWithPassword(
    Cypress.env('defaultAccount'),
    Cypress.env('defaultPassword')
  )
  cy.get('.xterm-screen').as('Terminaltextbox').should('be.visible')
  cy.findByRole('button', { name: 'Reset' }).click()
  cy.typeInCommand('clear{enter}')
  cy.get('@Terminaltextbox').should('contain', 'commander:~ $')
})
Cypress.Commands.add('typeInCommand', (command) => {
  cy.get('.xterm-screen', { timeout: 150000 }).type(command)
})
Cypress.Commands.add('getQuestInfo', (id) => {
  return cy.get('#quest').find('p.text-text').contains(`${id}`)
})
Cypress.Commands.add('getTaskCheckbox', (id) => {
  return cy.getQuestInfo(id).findByRole('checkbox')
})
Cypress.Commands.add('checkHint', (index, total) => {
  cy.get('#hint')
    .find('.flex-wrap')
    .contains(`${index}/${total}`)
    .should('be.visible')
})
