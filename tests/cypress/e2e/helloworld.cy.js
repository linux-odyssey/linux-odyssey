/// <reference types="cypress" />
export default function checkLoginUI() {
  cy.get('h1.text-text-primary')
    .should('contain', 'Linux Odyssey')
    .and('be.visible')
  cy.get('label[for="password"]')
    .should('contain', 'Password')
    .and('be.visible')
  cy.get('#password')
    .invoke('attr', 'placeholder')
    .should('contain', 'Enter your password')
}
export function clearFirstTask() {
  cy.get('@Terminaltextbox').type('echo Hello World!{enter}')
  cy.get('@Terminaltextbox').should('contain', '你聽到了一個聲音：')
  cy.get('@Terminaltextbox').type(
    '{enter}{enter}{enter}{enter}{enter}{enter}{enter}{enter}{enter}'
  )
}
export function checkStoryStart() {
  cy.get('@Terminaltextbox').should('contain', `Unix Spirit: `)
}
export const getQuestInfo = (id) =>
  cy.get('#quest').get('p.text-text').contains(`${id}`)
export const getTaskCheckbox = (id) =>
  getQuestInfo(`${id}`).findByRole('checkbox')
const YAML = require('yamljs')

describe('example helloworld app', () => {
  describe('Login tests', () => {
    beforeEach(() => {
      cy.visit('/')
    })
    it('Check Login Page Elements-Register', () => {
      checkLoginUI()
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
      cy.findByRole('button', { name: 'Register' }).should('be.visible')
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
      cy.get('label[for="username"]')
        .should('contain', 'Email / Username')
        .and('be.visible')
      cy.get('#username')
        .invoke('attr', 'placeholder')
        .should('contain', 'Enter your email or username')
      cy.findByRole('button', { name: 'Log in' }).should('be.visible')
      cy.get('span').contains("Don't have an account?").should('be.visible')
      cy.get('a.text-text-primary')
        .should('contain', 'Register')
        .and('be.visible')
    })
    it('Check social account UI', () => {
      cy.get('p').contains('Log in with social account').should('be.visible')
      cy.findByRole('link', { name: 'Google' }).should('be.visible')
      cy.findByRole('link', { name: 'GitHub' }).should('be.visible')
    })
    it('Login-Password Already Register', () => {
      cy.LoginWithPassword()
    })
    it.skip('Login-Google', () => {
      cy.clearCookies()
      cy.findByRole('link', { name: 'Google' }).should('be.visible').click()
    })
    it.skip('Login-GitHub', () => {
      cy.clearCookies()
      cy.findByRole('link', { name: 'GitHub' }).should('be.visible').click()
    })
  })
  describe('Game Start Page UI', () => {
    beforeEach(() => {
      cy.visit('/')
      cy.LoginWithPassword()
      cy.get('.xterm-screen').as('Terminaltextbox').should('be.visible')
      cy.findByRole('button', { name: 'Reset' }).click()
      cy.get('@Terminaltextbox').type('clear{enter}')
      cy.get('@Terminaltextbox').should('contain', 'commander:~ $')
    })
    it('Check Header', () => {
      cy.get('#quest').should('be.visible')
      cy.get('#stream').should('be.visible')
      cy.get('#backward').should('be.visible')
      cy.get('#warning').should('be.visible')
      cy.get('#setting').should('be.visible')
      cy.get('#fullscreen').should('be.visible')
      cy.get('p').contains(" 1. Command's Basics ").should('be.visible')
      cy.get('p').contains('●').should('be.visible')
      cy.get('p').contains('1. Try Your First Command').should('be.visible')
    })
    it('Check QuestInfo', () => {
      cy.get('#topic').should('contain', 'Hello, Linux World!')
      getQuestInfo(
        '你身在一個漆黑的房間裡，沒有任何的光線或聲音。你想不起來為什麼自己會來到這裡。但你的腦中隱約感到某個聲音跟你說： 「輸入 echo Hello World!」'
      ).should('be.visible')
      getQuestInfo('Tasks:').should('be.visible')
      getQuestInfo('使用 `echo Hello World!` 召喚精靈').should('be.visible')
      getTaskCheckbox('使用 `echo Hello World!` 召喚精靈').should(
        'not.be.checked'
      )
    })
    it('Check Command Cheat Sheet', () => {
      cy.get('#cmdlist').should('be.visible')
      cy.get('#cmdlist').get('svg[data-icon="list"]').should('be.visible')
      cy.get('#cmdlist')
        .get('h1')
        .should('contain', 'Command Cheatsheets')
        .and('be.visible')
      cy.get('#cheatsheets')
        .should('contain', '--Command List--')
        .and('be.visible')
    })
    it('Check Terminal', () => {
      cy.get('#terminal').should('be.visible')
      cy.get('#terminal').get('svg[data-icon="terminal"]').should('be.visible')
      cy.get('#terminal')
        .findByRole('button')
        .should('contain', 'Terminal')
        .and('be.visible')
      cy.get('@Terminaltextbox')
        .should('be.visible')
        .and('contain', 'Welcome to Linux Odyssey!')
        .and('contain', 'commander:~ $')
    })
    it('Check Hint Part', () => {
      cy.get('#hint').should('be.visible')
      cy.get('#hint').get('svg[data-icon="lightbulb"]').should('be.visible')
      cy.get('#hint').get('h1').should('contain', 'Hint').and('be.visible')
    })
    it('Check File TreeChart', () => {
      cy.get('#visualization').should('be.visible')
      cy.get('#tree').should('be.visible')
      cy.get('#tree').get('a').should('contain', '???').and('be.visible')
    })
    it('Check Fucnctional Buttons', () => {
      cy.findByRole('button', { name: 'Solution' }).should('be.visible')
      cy.findByRole('button', { name: 'Reset' }).should('be.visible')
      cy.findByRole('button', { name: 'Continue' }).should('be.visible')
    })
  })
  describe.only('Game Play', () => {
    beforeEach(() => {
      cy.visit('/')
      cy.readFile('.././quests/helloworld/game.yml', 'utf-8').as('gameScript')
      cy.LoginWithPassword()
      cy.get('.xterm-screen').as('Terminaltextbox')
      cy.findByRole('button', { name: 'Reset' }).click()
      cy.get('@Terminaltextbox').should('contain', 'commander')
    })
    it('Typing in Terminal', () => {
      cy.get('@Terminaltextbox').type('12345{enter}')
      cy.get('@Terminaltextbox')
        .should('contain', 'zsh: command not found: 12345')
        .and('contain', '12345')
    })
    it('Clear first task', () => {
      cy.get('@Terminaltextbox').type('echo Hello World!{enter}')
      cy.get('@Terminaltextbox').should('contain', '你聽到了一個聲音：')
      cy.get('@Terminaltextbox').type(
        '{enter}{enter}{enter}{enter}{enter}{enter}{enter}{enter}{enter}'
      )
      getTaskCheckbox('使用 `echo Hello World!` 召喚精靈').should('be.checked')
      getQuestInfo('搜索卷軸').should('be.visible')
      getTaskCheckbox('搜索卷軸').should('not.be.checked')
      cy.get('@Terminaltextbox')
        .should('contain', `Unix Spirit: `)
        .and('contain', '你好，指令官，我是你的 Unix 精靈。我已在此恭候多時。')
        .and(
          'contain',
          `這個世界是在 3560000 時脈以前，由初代王建立了 Unix 律法，所形成的世界。然而在經過了好幾世代的王後，終於誕生了永恆之王——薩加（Saga），她比歷代的君王都更為強大，且從來不會衰老，使得這個世界變得前所未有的強大。`
        )
        .and(
          'contain',
          `然而，外在世界一直不斷在改變，同時在面臨外敵的不斷攻擊，而薩加卻始終用同一套治理的手段。最終，在 160000 時脈前的一次入侵中，根部遭到攻陷，薩加遭到封印，而這個國家也陷入了黑暗。`
        )
        .and(
          'contain',
          `由於長久以來依賴於薩加，世人已失去了「指令」的力量，即將走向衰敗和滅亡的命運。`
        )
        .and(
          'contain',
          `你的任務，就是找回被世人遺忘的指令，奪回 Linux 之根，成為 Linux 之王。`
        )
        .and('contain', `首先，你必須要學會如何使用指令。`)
        .and(
          'contain',
          `你要學習的第一個指令，是「發現」的指令：\`ls\`。ls 可以用來查看一個目錄中有哪些檔案。`
        )
        .and('contain', `現在，請你輸入 \`ls\` 來查看目前的目錄下有哪些檔案。`)
      cy.get('#Lbutton').should('be.visible').and('be.disabled')
      cy.get('#Rbutton').should('be.visible').and('be.disabled')
      cy.get('#hint')
        .get('.flex-wrap')
        .invoke('text')
        .should('contain', '1/1')
        .and('contain', '使用 `ls` 指令來查看目前的目錄下有哪些檔案。')
    })
    it.only('Clear second task', () => {
      clearFirstTask()
      // try read from yml todo ignore upper text
      cy.get('@gameScript').then((text) => {
        const script = YAML.parse(text)
        cy.get('@Terminaltextbox').should(
          'contain',
          script.stages[0].responses[1].content[0]
        )
        cy.get('@Terminaltextbox')
          .get('.xterm-rows')
          .find('div')
          .each(($el, i) => {
            expect($el.text()).to.contain(
              // should ignore upper text to match just story part
              script.stages[0].responses[1].content[i]
            )
          })
      })
      cy.get('@Terminaltextbox').type('ls{enter}')
      checkStoryStart()
      cy.get('@Terminaltextbox').type('{enter}{enter}{enter}{enter}{enter}')
      cy.get('@Terminaltextbox')
        .should('contain', `forgotten_scroll.txt`)
        .and('contain', '你找到了一個被遺忘的卷軸，上面寫著解除封印的咒語。')
      cy.get('@Terminaltextbox').type('{enter}{enter}{enter}{enter}{enter}')
      cy.get('@Terminaltextbox')
        .and('contain', '使用指令 `cat [檔案名稱]` 來查看檔案內容。')
        .and(
          'contain',
          '我可以為你提供一些指令的提示，只要輸入指令的前幾個字元，然後按下 `Tab` 鍵，就可以看到提示了。'
        )
        .and(
          'contain',
          '例如，你可以輸入 `ca` 然後按下 `Tab` 鍵，就可以看到 `cat` 這個指令的提示了。'
        )
        .and(
          'contain',
          '檔案名稱也一樣，只要輸入檔案名稱的前幾個字元，然後按下 `Tab` 鍵，就可以看到提示了。'
        )
    })
  })
})
