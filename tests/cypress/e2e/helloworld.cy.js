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
        '以Google繼續',
        'Continue with Google'
      )
      cy.CheckTextElement('#or', '或', 'or')
      cy.CheckTextElement(
        '#GitHubLogin',
        '以GitHub繼續',
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
    beforeEach(() => {
      cy.PrepareForGame()
    })
    it('Check Header', () => {
      cy.get('#HeaderText')
        .should('contain', 'Hello, Linux World!')
        .and('be.visible')
      cy.findByRole('link', { name: 'Bug Report' }).should('be.visible')
      cy.findByRole('button', { name: 'Sign Out' }).should('be.visible')
    })
    it('Check QuestInfo', () => {
      cy.get('#topic').should('contain', 'Hello, Linux World!')
      cy.get('#quest').find('p.text-text').should('have.length', 3)
      cy.CheckTextElement('#tasks', '任務', 'Tasks:')
      cy.getQuestInfo('輸入 `echo help` 來朗誦咒語').should('be.visible')
    })
    it('Check Command Cheat Sheet', () => {
      cy.get('#cmdlist').within(($cmdlist) => {
        cy.get($cmdlist).should('be.visible')
        cy.get('svg[data-icon="list"]').should('be.visible')
        cy.CheckTextElement('#CommandBook', '指令之書', 'Command Cheatsheets')
        cy.CheckTextElement(
          '#cheatsheets',
          '-- --指令列表-- --',
          '--Command List--'
        )
      })
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
      cy.readFile('../quests/helloworld/answer.sh', 'utf-8').as('answers')
    })
    it('Typing in Terminal', () => {
      cy.typeInCommand('12345{enter}')
      cy.get('@Terminaltextbox')
        .should('contain', 'zsh: command not found: 12345')
        .and('contain', '12345')
    })
    it('Complete the Game(relating UI)', () => {
      // get answersheet
      cy.get('@answers').then((answers) => {
        const answerarr = answers.split('\n')
        // Stage1
        cy.log('Stage1')
        cy.typeInCommand(answerarr[0])
        cy.checkPending()
        cy.waitUntilActive()
        cy.get('#Lbutton').should('be.visible').and('be.disabled')
        cy.get('#Rbutton').should('be.visible').and('be.disabled')
        cy.checkHint(1, 1)
        cy.getQuestInfo('✓ 輸入 `echo help` 來朗誦咒語').should('be.visible')
        cy.getQuestInfo('搜索卷軸').should('be.visible')
        // Stage2
        cy.log('Stage2')
        cy.typeInCommand(answerarr[1])
        cy.checkPending()
        cy.waitUntilActive()
        cy.get('#tree')
          .get('a')
          .should('contain', 'forgotten_scroll.txt')
          .and('be.visible')
        cy.get('#Lbutton').should('be.visible').and('be.enabled')
        cy.get('#Rbutton').should('be.visible').and('be.disabled')
        cy.checkHint(2, 2)
        cy.get('#Lbutton').click()
        cy.get('#Rbutton').should('be.enabled')
        cy.getQuestInfo('✓ 搜索卷軸').should('be.visible')
        cy.getQuestInfo('查看卷軸').should('be.visible')
        // Stage3
        cy.log('Stage3')
        cy.typeInCommand(answerarr[2])
        cy.checkPending()
        cy.waitUntilActive()
        cy.getQuestInfo('✓ 查看卷軸').should('be.visible')
        cy.getQuestInfo('解除封印').should('be.visible')
        cy.checkHint(3, 3)
        // Stage4
        cy.log('Stage4')
        cy.typeInCommand(answerarr[3])
        cy.checkPending()
        cy.waitUntilActive()
        cy.getQuestInfo('✓ 解除封印').should('be.visible')
        // Check survey dialog pop up
        cy.CheckTextElement('#QuestCompleted', '關卡完成！', 'Quest Completed!')
        cy.get('div[class="modal"]').find('p').should('be.visible')
        cy.findByRole('link', { name: '填寫問卷' }).should('be.visible')
      })
    })
  })
})
