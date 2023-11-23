import '@testing-library/cypress/add-commands'

Cypress.Commands.add('LoginWithPassword', (username, password) => {
  cy.clearAllCookies({ domain: null })
  cy.visit('/login')
  cy.get('#username').type(username)
  cy.get('#password').type(password)
  cy.get('#LogInOrSignUp').click()
})
Cypress.Commands.add('PrepareForGame', () => {
  cy.visit('/')
  // make sure the login page is loaded
  cy.url().should('satisfy', (elements) => {
    const text = elements
    return text.includes('login') || text.includes('register')
  })
  cy.LoginWithPassword(
    Cypress.env('defaultAccount'),
    Cypress.env('defaultPassword')
  )
  // make sure the map page is loaded
  cy.url().should('include', '/map')
  cy.visit('/game/helloworld')
  // make sure the game page is loaded
  cy.url().should('include', '/game/helloworld')
  cy.get('.xterm-screen', { timeout: 30000 })
    .as('Terminaltextbox')
    .should('be.visible')
  cy.CheckTextElement('#reset', '重來', 'Reset').click()
  cy.typeInCommand('clear{enter}')
  cy.get('@Terminaltextbox', { timeout: 150000 }).should(
    'contain',
    'commander:~ $'
  )
})
Cypress.Commands.add('typeInCommand', (command) => {
  cy.get('.xterm-screen', { timeout: 150000 }).type(command)
})
Cypress.Commands.add('getQuestInfo', (id) => {
  return cy
    .get('#quest')
    .find('li')
    .find('p')
    .contains(`${id}`, { timeout: 100000 })
})
Cypress.Commands.add('checkHint', (index, total) => {
  cy.get('#hint')
    .find('.justify-end')
    .contains(`${index}/${total}`)
    .should('be.visible')
})
Cypress.Commands.add('waitUntilActive', () => {
  cy.get('input[id="currentStatus"]', { timeout: 1000000 })
    .invoke('val')
    .then((value) => {
      if (value === 'active' || value === 'finished') {
        cy.log('story ends')
        return
      }
      cy.typeInCommand('{enter}')
      cy.waitUntilActive()
    })
})
Cypress.Commands.add('checkPending', () => {
  cy.get('input[id="currentStatus"]', { timeout: 1000000 }).should(
    'have.value',
    'pending'
  )
})
Cypress.Commands.add('Complete the Stage (only command)', () => {
  cy.log('')
})
Cypress.Commands.add('CheckTextElement', (id, chText, enText) => {
  cy.get(id).within(($element) => {
    if (Cypress.env('isCHVersion')) {
      cy.get($element).should('contain', chText).and('be.visible')
    } else {
      cy.get($element).should('contain', enText).and('be.visible')
    }
  })
})
Cypress.Commands.add('CheckPlaceholder', (id, chText, enText) => {
  cy.get(id)
    .invoke('attr', 'placeholder')
    .then(($placeHolder) => {
      if (Cypress.env('isCHVersion')) {
        expect($placeHolder).eq(chText)
      } else {
        expect($placeHolder).eq(enText)
      }
    })
})
