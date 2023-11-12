/// <reference types="cypress" />

export default function checkLoginUI() {
  cy.get('h1.text-text-primary')
    .should('contain', 'Linux Odyssey')
    .and('be.visible')
  cy.get('#password')
    .invoke('attr', 'placeholder')
    .should('contain', 'Password')
}
export function getTerminalrowsContain(content) {
  cy.get('@Terminaltextbox')
    .get('.xterm-rows')
    .children()
    .filter(`:contains('${content}')`)
}
const finishSign = 'commander:~ $'
const continueSign = '↵'
const storyStart = 'Unix Spirit: '

describe('example helloworld app', () => {
  describe('Login tests', () => {
    beforeEach(() => {
      cy.visit('/')
    })
    it('Check Login Page Elements-Register', () => {
      checkLoginUI()
      cy.get('#username')
        .invoke('attr', 'placeholder')
        .should('contain', 'Username')
      cy.get('label.text-text-secondary')
        .should('contain', `Username must begin with lowercase letter`)
        .and(
          'contain',
          `Username can consist of lowercase, numbers, "_", and "-"`
        )
        .and('be.visible')
      cy.get('#email').invoke('attr', 'placeholder').should('contain', 'Email')
      cy.get('span').contains('Already have an account?').should('be.visible')
      cy.get('a.text-text-primary')
        .should('contain', 'Log in')
        .and('be.visible')
    })
    it('Check Login Page Elements-Login', () => {
      cy.get('a.text-text-primary')
        .should('contain', 'Log in')
        .and('be.visible')
        .click()
      checkLoginUI()
      cy.get('#username')
        .invoke('attr', 'placeholder')
        .should('contain', 'Email / Username')
      cy.findByRole('button', { name: 'Log In' }).should('be.visible')
      cy.get('span').contains("Don't have an account?").should('be.visible')
      cy.get('a.text-text-primary')
        .should('contain', 'Sign up')
        .and('be.visible')
    })
    it('Check social account UI', () => {
      cy.get('p').contains('or').should('be.visible')
      cy.findByRole('link', { name: 'Continue with Google' }).should(
        'be.visible'
      )
      cy.findByRole('link', { name: 'Continue with GitHub' }).should(
        'be.visible'
      )
    })
    it('Login-Password Already Register', () => {
      cy.LoginWithPassword(
        Cypress.env('defaultAccount'),
        Cypress.env('defaultPassword')
      )
    })
  })
  describe('Game Start Page UI', () => {
    beforeEach(() => {
      cy.PrepareForGame()
    })
    it('Check Header', () => {
      cy.findByRole('button', { name: 'Hello, Linux World!' }).should(
        'be.visible'
      )
    })
    it('Check QuestInfo', () => {
      cy.get('#topic').should('contain', 'Hello, Linux World!')
      cy.getQuestInfo(
        '你身在一個漆黑的房間裡，沒有任何的光線或聲音。你想不起來為什麼自己會來到這裡。但你的腦中隱約感到某個聲音跟你說： 「輸入 echo Hello World!」'
      ).should('be.visible')
      cy.getQuestInfo('Tasks:').should('be.visible')
      cy.getQuestInfo('使用 `echo Hello World!` 召喚精靈').should('be.visible')
      cy.getTaskCheckbox('使用 `echo Hello World!` 召喚精靈').should(
        'not.be.checked'
      )
    })
    it('Check Command Cheat Sheet', () => {
      cy.get('#cmdlist').within(($cmdlist) => {
        cy.get($cmdlist).should('be.visible')
        cy.get('svg[data-icon="list"]').should('be.visible')
        cy.get('h1').should('contain', 'Command Cheatsheets').and('be.visible')
        cy.get('#cheatsheets')
          .should('contain', '--Command List--')
          .and('be.visible')
      })
    })
    it('Check Terminal', () => {
      cy.get('#terminal', { timeout: 20000 }).within(($terminal) => {
        cy.get($terminal).should('be.visible')
        cy.get('svg[data-icon="terminal"]').should('be.visible')
        cy.findByRole('button').should('contain', 'Terminal').and('be.visible')
        cy.get('@Terminaltextbox')
          .should('be.visible')
          .and('contain', 'commander:~ $')
      })
    })
    it('Check Hint Part', () => {
      cy.get('#hint', { timeout: 20000 }).within(($hint) => {
        cy.get($hint).should('be.visible')
        cy.get('svg[data-icon="lightbulb"]').should('be.visible')
        cy.get('h1').should('contain', 'Hint').and('be.visible')
      })
    })
    it('Check File TreeChart', () => {
      cy.get('#tree').should('be.visible')
      cy.get('#tree').get('a').should('contain', '???').and('be.visible')
    })
    it('Check Fucnctional Buttons', () => {
      cy.findByRole('button', { name: 'Solution' }, { timeout: 30000 }).should(
        'be.visible'
      )
      cy.findByRole('button', { name: 'Reset' }).should('be.visible')
      cy.findByRole('button', { name: 'Continue' }).should('be.visible')
    })
  })
  describe.only('Game Play', () => {
    beforeEach(() => {
      cy.PrepareForGame()
      cy.readFile('../quests/helloworld/answer.sh', 'utf-8').as('answers')
    })
    it('Typing in Terminal', () => {
      cy.typeInCommand('12345{enter}')
      cy.get('@Terminaltextbox')
        .should('contain', 'zsh: command not found: 12345')
        .and('contain', '12345')
    })
    it('Complete the Game', () => {
      // get answersheet
      cy.get('@answers').then((answers) => {
        const answerarr = answers.split('\n')
        // Stage1
        cy.log('Stage1')
        cy.typeInCommand(answerarr[0])
        cy.get('@Terminaltextbox').should('contain', continueSign)
        cy.typeInCommand(
          '{enter}{enter}{enter}{enter}{enter}{enter}{enter}{enter}{enter}'
        )
        cy.getTaskCheckbox('使用 `echo Hello World!` 召喚精靈').should(
          'be.checked'
        )
        cy.getTaskCheckbox('搜索卷軸')
          .should('be.visible')
          .and('not.be.checked')
        cy.get('@Terminaltextbox')
          .contains(storyStart)
          .nextUntil(`:contains('${finishSign}')`)
        cy.get('#Lbutton').should('be.visible').and('be.disabled')
        cy.get('#Rbutton').should('be.visible').and('be.disabled')
        cy.checkHint(1, 1)
        // Stage2
        cy.log('Stage2')
        cy.typeInCommand(answerarr[1])
        cy.get('@Terminaltextbox')
          .contains(answerarr[8].replace('{enter}', '').replace('cat ', ''))
          .wait(1000)
          .nextUntil(`:contains('${continueSign}')`)
        cy.get('#tree')
          .get('a')
          .should('contain', 'forgotten_scroll.txt')
          .and('be.visible')
        cy.typeInCommand('{enter}{enter}{enter}{enter}{enter}')
        cy.getTaskCheckbox('搜索卷軸').should('be.checked')
        cy.getTaskCheckbox('移動到下一個房間')
          .should('be.visible')
          .and('not.be.checked')
        cy.getTaskCheckbox('查看卷軸')
          .should('be.visible')
          .and('not.be.checked')
        cy.get('@Terminaltextbox')
          .contains(storyStart)
          .nextUntil(`:contains('${finishSign}')`)
        cy.get('#Lbutton').should('be.visible').and('be.enabled')
        cy.get('#Rbutton').should('be.visible').and('be.disabled')
        cy.checkHint(3, 3)
        cy.get('#Lbutton').click()
        cy.get('#Rbutton').should('be.enabled')
        cy.checkHint(2, 3)
        // Stage secret
        cy.log('Stage secret')
        cy.typeInCommand(answerarr[2])
        cy.typeInCommand(answerarr[3])
        cy.get('#tree').get('a').should('contain', 'jail').and('be.visible')
        cy.typeInCommand(answerarr[4])
        cy.get('@Terminaltextbox')
          .contains(answerarr[4].replace('{enter}', ''))
          .wait(1000)
          .nextUntil(`:contains('${continueSign}')`)
        cy.typeInCommand(`{enter}{enter}{enter}`)
        cy.typeInCommand(answerarr[5])
        cy.typeInCommand(answerarr[6])
        cy.typeInCommand(answerarr[7])
        cy.get('#tree').get('a').contains('jail').and('not.exist')
        cy.getTaskCheckbox('移動到下一個房間').should('be.checked')
        // Stage3
        cy.log('Stage3')
        cy.typeInCommand(answerarr[8])
        cy.get('@Terminaltextbox')
          .contains(answerarr[8].replace('{enter}', ''))
          .wait(1000)
          .nextUntil(`:contains('${continueSign}')`)
        cy.typeInCommand('{enter}{enter}')
        cy.getTaskCheckbox('查看卷軸').should('be.checked')
        cy.get('@Terminaltextbox')
          .contains(answerarr[8].replace('{enter}', ''))
          .nextUntil(`:contains('${finishSign}')`)
        // Stage4
        cy.log('Stage4')
        cy.typeInCommand(answerarr[9])
        cy.get('@Terminaltextbox')
          .contains(answerarr[9].replace('{enter}', ''))
          .wait(1000)
          .nextUntil(`:contains('${continueSign}')`)
        cy.findByRole(
          'heading',
          { name: 'Quest Completed!' },
          { timeout: 20000 }
        ).should('be.visible')
        // Check survey dialog pop up
        cy.get('div[class="modal"]').find('p').should('be.visible')
        cy.findByRole('link', { name: '填寫問卷' }).should('be.visible')
      })
    })
  })
})
