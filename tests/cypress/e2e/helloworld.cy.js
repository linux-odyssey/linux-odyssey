/// <reference types="cypress" />
export default function checkLoginUI() {
  cy.get('h1.text-text-primary')
    .should('contain', 'Linux Odyssey')
    .and('be.visible')
  cy.CheckPlaceholder('#password', '密碼', 'Password')
}
describe('example helloworld app', () => {
  describe('Login tests', () => {
    beforeEach(() => {
      cy.visit('/')
    })
    it('Check Login Page Elements-Register', () => {
      checkLoginUI()
      cy.CheckPlaceholder('#username', '帳號名稱', 'Username')
      cy.get('label.text-text-secondary').should('be.visible') // check the rules is displayed
      cy.CheckPlaceholder('#email', '電子郵件', 'Email')
      cy.CheckTextElement(
        '#CheckRegistered',
        '已經有帳號了嗎？',
        'Already have an account?'
      )
      cy.CheckTextElement('#SwitchtoLogin', '登入', 'Log in')
    })
    it('Check Login Page Elements-Login', () => {
      cy.get('#SwitchtoLogin').click()
      checkLoginUI()
      cy.CheckPlaceholder(
        '#username',
        '電子郵件 / 帳號名稱',
        'Email / Username'
      )
      cy.get('#LogInOrSignUp').should('be.visible')
      cy.CheckTextElement(
        '#CheckRegistered',
        '還沒有帳號嗎？',
        "Don't have an account?"
      )
      cy.CheckTextElement('#SwitchtoRegister', '註冊', 'Sign up')
    })
    it('Check social account UI', () => {
      cy.CheckTextElement(
        '#GoogleLogin',
        '以 Google 繼續',
        'Continue with Google'
      )
      cy.CheckTextElement('#or', '或', 'or')
      cy.CheckTextElement(
        '#GitHubLogin',
        '以 GitHub 繼續',
        'Continue with GitHub'
      )
    })
    it('Check login fail', () => {
      cy.LoginWithPassword('dddd', '123456')
      cy.CheckTextElement(
        '#ErrorDisplay',
        '錯誤的帳號名稱或密碼。',
        'Wrong username or password.'
      )
      cy.LoginWithPassword(`ddd\``, '123456')
      cy.CheckTextElement(
        '#ErrorDisplay',
        '無效的帳號名稱或密碼。',
        'Invalid username or password.'
      )
    })
    it('Login-Password Already Register', () => {
      cy.LoginWithPassword(
        Cypress.env('defaultAccount'),
        Cypress.env('defaultPassword')
      )
      cy.url().should('include', '/map')
    })
  })
  describe('Game Start Page UI', () => {
    const title = '終端機的基本知識'
    beforeEach(() => {
      cy.PrepareForGame()
    })
    it('Check Header', () => {
      cy.get('#HeaderText').should('contain', title).and('be.visible')
      cy.findByRole('link', { name: 'Bug Report' }).should('be.visible')
      cy.findByRole('button', { name: 'Sign Out' }).should('be.visible')
    })
    it('Check QuestInfo', () => {
      cy.get('#topic').should('contain', title)
      cy.get('#quest').find('p.text-text').should('have.length', 4)
      cy.CheckTextElement('#tasks', '任務', 'Tasks:')
      cy.getQuestInfo('輸入 `echo help` 來朗誦咒語').should('be.visible')
    })
    it('Check Terminal', () => {
      cy.get('#terminal', { timeout: 20000 }).within(($terminal) => {
        cy.get($terminal).should('be.visible')
        cy.get('svg[data-icon="terminal"]').should('be.visible')
        cy.CheckTextElement('#Terminal', '終端機', 'Terminal')
        cy.get('@Terminaltextbox')
          .should('be.visible')
          .and('contain', 'commander:~ $')
      })
    })
    it('Check Hint Part', () => {
      cy.get('#hint', { timeout: 20000 }).within(($hint) => {
        cy.get($hint).should('be.visible')
        cy.get('svg[data-icon="lightbulb"]').should('be.visible')
      })
      cy.CheckTextElement('#hint', '提示', 'Hint')
    })
    it('Check File TreeChart', () => {
      cy.get('#tree').should('be.visible')
      cy.get('#tree').get('a').should('contain', '???').and('be.visible')
    })
    it('Check Fucnctional Buttons', () => {
      cy.CheckTextElement('#solution', '解答', 'Solution')
      cy.CheckTextElement('#reset', '重來', 'Reset')
      cy.CheckTextElement('#continue', '繼續', 'Continue')
    })
  })
  describe('Game Play', () => {
    beforeEach(() => {
      cy.PrepareForGame()
    })
    it('Typing in Terminal', () => {
      cy.typeInCommand('12345{enter}')
      cy.get('@Terminaltextbox')
        .should('contain', 'zsh: command not found: 12345')
        .and('contain', '12345')
    })
    it('Complete the Game(relating UI)', () => {
      // Stage1
      cy.log('Stage1')
      cy.typeInCommand('echo start{enter}')
      cy.checkPending()
      cy.waitUntilActive()
      cy.get('#Lbutton').should('be.visible').and('be.disabled')
      cy.get('#Rbutton').should('be.visible').and('be.disabled')
      cy.checkHint(1, 1)
      cy.getQuestInfo('✓ 輸入 `echo start` 來開始教程').should('be.visible')
      cy.getQuestInfo('➤ 在終端機輸入 `echo hello`').should('be.visible')
      // Stage2
      cy.log('Stage2')
      cy.typeInCommand('echo hello{enter}')
      cy.checkPending()
      cy.waitUntilActive()
      // cy.get('#tree')
      //   .get('a')
      //   .should('contain', 'forgotten_scroll.txt')
      //   .and('be.visible')
      cy.get('#Lbutton').should('be.visible').and('be.enabled')
      cy.get('#Rbutton').should('be.visible').and('be.disabled')
      cy.checkHint(2, 2)
      cy.get('#Lbutton').click()
      cy.get('#Rbutton').should('be.enabled')
      cy.getQuestInfo('✓ 在終端機輸入 `echo hello`').should('be.visible')
      cy.getQuestInfo('➤ 結束關卡').should('be.visible')
      // Stage3
      cy.log('Stage3')
      cy.typeInCommand('echo finish{enter}')
      cy.checkPending()
      cy.waitUntilActive()
      cy.getQuestInfo('✓ 結束關卡').should('be.visible')
      cy.CheckTextElement('#QuestCompleted', '關卡完成！', 'Quest Completed!')
      cy.get('div[class="modal"]').find('p').should('be.visible')
      cy.findByRole('link', { name: '填寫問卷' }).should('be.visible')
    })
  })
})
