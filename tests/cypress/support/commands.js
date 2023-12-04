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
  cy.visit('/game/get-started')
  cy.url().should('include', '/game/get-started')
  cy.get('.xterm-screen', { timeout: 10000 })
    .as('Terminaltextbox')
    .should('be.visible')
  cy.checkTaskInit()
  cy.CheckTextElement('#reset', '重來', 'Reset').click()
  cy.checkTaskInit()
  cy.InitTerminal()
})
Cypress.Commands.add('InitTerminal', () => {
  cy.get('@Terminaltextbox', { timeout: 150000 }).should(
    'contain',
    'commander:~ $'
  )
  cy.log('Check terminal init done')
})
Cypress.Commands.add('typeInCommand', (command) => {
  cy.get('.xterm-screen', { timeout: 150000 }).type(command, {
    delay: 100,
  })
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
Cypress.Commands.add('checkTaskInit', () => {
  cy.get('#tasks').next().children().should('be.visible')
})
Cypress.Commands.add('waitUntilActive', () => {
  cy.get('input[id="currentStatus"]', { timeout: 1000000 })
    .invoke('val')
    .then((value) => {
      if (value === 'active') {
        cy.log('story ends')
        return
      }
      if (value === 'finished') {
        cy.log('Quest Finished')
        return
      }
      if (value === 'pending') {
        cy.typeInCommand('{enter}')
        cy.waitUntilActive()
      }
    })
})
Cypress.Commands.add('checkPending', () => {
  cy.get('input[id="currentStatus"]', { timeout: 1000000 }).should(
    'have.value',
    'pending'
  )
})
Cypress.Commands.add('CompleteStageWithCommands', (stagename) => {
  cy.visit(`/game/${stagename}`)
  cy.url().should('include', `/game/${stagename}`)
  cy.log(`Completing stage :${stagename}`)
  cy.checkTaskInit()
  cy.CheckTextElement('#reset', '重來', 'Reset').click()
  cy.checkTaskInit()
  cy.InitTerminal()
  cy.readFile(`../quests/${stagename}/answer.sh`, 'utf-8').as('answers')
  cy.get('@answers').then((answers) => {
    const answerarr = answers.split('\n')
    for (const element of answerarr) {
      cy.typeInCommand(`${element}{enter}`)
      if (answerarr.indexOf(element) + 1 !== answerarr.length) {
        cy.checkPending()
        cy.waitUntilActive()
      }
      if (answerarr.indexOf(element) + 1 === answerarr.length) {
        cy.waitUntilActive()
        cy.CheckTextElement('#QuestCompleted', '關卡完成！', 'Quest Completed!')
        cy.get('div[class="modal"]').find('p').should('be.visible')
        cy.get('#BacktoMap').should('be.visible').and('contain', '回到地圖')
      }
    }
  })
})
Cypress.Commands.add('CheckTextElement', (id, chText, enText) => {
  cy.get(id, { timeout: 100000 }).within(($element) => {
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
Cypress.Commands.add('CheckTreeElement', (element) => {
  cy.get('#tree').get('a').should('contain', `${element}`).and('be.visible')
})
