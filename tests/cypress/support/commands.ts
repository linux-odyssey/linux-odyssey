/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/// <reference types="cypress" />
import '@testing-library/cypress/add-commands'

declare const expect: Chai.ExpectStatic
declare global {
  namespace Cypress {
    interface Chainable {
      LoginWithPassword(username: string, password: string): Chainable<string>
      PrepareForGame(): Chainable<void>
      InitTerminal(): Chainable<void>
      typeInCommand(command: string): Chainable<string>
      getQuestInfo(id: string): Chainable<JQuery<HTMLParagraphElement>>
      checkHint(index: number, total: number): Chainable<number> // 修改類型
      checkTaskInit(): Chainable<void>
      waitUntilActive(last?: boolean): Chainable<void> // 注意小寫boolean，並且變量名應該是小寫
      checkPending(): Chainable<void>
      CompleteStageWithCommands(stagename: string): Chainable<string>
      CheckTextElement(
        id: string,
        chText: string,
        enText: string
      ): Chainable<string>
      CheckPlaceholder(
        id: string,
        chText: string,
        enText: string
      ): Chainable<string>
      CheckTreeElement(element: string): Chainable<string>
    }
  }
}
Cypress.Commands.add('LoginWithPassword', (username, password) => {
  cy.clearAllCookies()
  cy.visit('/login')
  cy.get('#username').type(username)
  cy.get('#password').type(password)
  cy.get('#LogInOrSignUp').click()
})
Cypress.Commands.add('PrepareForGame', (questId) => {
  cy.visit('/')
  // make sure the login page is loaded
  cy.url().should('satisfy', (elements: string) => {
    const text = elements
    return text.includes('login') || text.includes('register')
  })
  cy.LoginWithPassword(
    Cypress.env('defaultAccount'),
    Cypress.env('defaultPassword')
  )
  // make sure the map page is loaded
  cy.url().should('include', '/map')
  const url = `/game/${questId}`
  cy.visit(url)
  cy.url().should('include', url)
  // check task first so the terminal has better possibility loaded
  cy.checkTaskInit()
  cy.get('.xterm-screen', { timeout: 10000 })
    .as('Terminaltextbox')
    .should('be.visible')
  cy.CheckTextElement('#reset', '重來', 'Reset').click()
  cy.checkTaskInit()
  cy.InitTerminal()
})
Cypress.Commands.add('InitTerminal', () => {
  cy.get('@Terminaltextbox', { timeout: 15000 }).should(
    'contain',
    'commander:~ $'
  )
  cy.log('Check terminal init done')
})
Cypress.Commands.add('typeInCommand', (command) => {
  cy.get('.xterm-screen', { timeout: 15000 }).type(command)
})
Cypress.Commands.add('getQuestInfo', (id) => {
  return cy
    .get('#quest')
    .find('li')
    .find('p')
    .contains(`${id}`, { timeout: 10000 })
})
Cypress.Commands.add('checkHint', (index, total) => {
  cy.get('#hint')
    .find('.justify-end')
    .contains(`${index}/${total}`)
    .should('be.visible')
})
Cypress.Commands.add('checkTaskInit', () => {
  cy.get('#tasks').next().children().should('be.visible')
})
Cypress.Commands.add('waitUntilActive', (last = false) => {
  cy.get('input[id="currentStatus"]', { timeout: 10000 })
    .invoke('val')
    .then((value) => {
      if (value === 'active') {
        cy.log('story ends')
        return
      }
      if (value === 'finished' && last) {
        cy.log('Quest Finished')
        return
      }
      if (value === 'pending' && !last) {
        cy.log(`${last}`)
        cy.typeInCommand('{enter}')
        cy.waitUntilActive(last) // Pass `last` parameter
      }
    })
})
Cypress.Commands.add('checkPending', () => {
  cy.get('input[id="currentStatus"]', { timeout: 10000 }).should(
    'have.value',
    'pending'
  )
})
Cypress.Commands.add('CompleteStageWithCommands', (stagename) => {
  cy.PrepareForGame(stagename)
  cy.log(`Completing stage :${stagename}`)
  cy.checkTaskInit()
  cy.CheckTextElement('#reset', '重來', 'Reset').click()
  cy.checkTaskInit()
  cy.InitTerminal()
  cy.readFile(`../quests/${stagename}/answer.sh`, 'utf-8').then((answers) => {
    const answerarr = answers.split('\n')
    answerarr.forEach((element, index) => {
      cy.typeInCommand(`${element}{enter}`)
      if (index < answerarr.length - 1) {
        cy.waitUntilActive()
      } else {
        cy.waitUntilActive(true).then(() => {
          cy.CheckTextElement(
            '#QuestCompleted',
            '關卡完成！',
            'Quest Completed!'
          )
          cy.get('div[class="modal"]').find('p').should('be.visible')
          cy.get('#BacktoMap').should('be.visible').and('contain', '回到地圖')
        })
      }
    })
  })
})
Cypress.Commands.add('CheckTextElement', (id, chText, enText) => {
  if (Cypress.env('isCHVersion')) {
    cy.get(id, { timeout: 50000 }).should('contain', chText).and('be.visible')
  } else {
    cy.get(id, { timeout: 50000 }).should('contain', enText).and('be.visible')
  }
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
Cypress.Commands.add('CheckTreeElement', (element) => {
  cy.get('#tree').get('a').should('contain', `${element}`).and('be.visible')
})
