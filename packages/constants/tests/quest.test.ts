import { describe, it, expect } from '@jest/globals'
import { questSchema } from '../src/index.js'

describe('Test quest schema', () => {
  it('should parse quest schema', () => {
    const sampleQuest = {
      id: 'get-started',
      image: 'base',
      title: '終端機的基本知識',
      instruction: `歡迎來到 Linux Odyssey！
  在這個關卡中，你將會學到：
  1. 如何使用這個網站
  2. 如何使用終端機`,
      stages: [
        {
          id: 'start',
          task: '按下 `開始` ����開始',
          condition: {
            command: ['^echo start$'],
          },
          responses: [
            {
              content: `在畫面的中下方的區��是終端機，你可以在終端機��輸入指令來操作電��。
  在終端機中，你所看到的 \`commander:~ $\` 叫做命令提示字串。
  ��令提示字串最後的��字號 \`$\` 叫命令提示符，你必須將指令輸入在它的後方。
  ��你輸入完指令並按下 Enter 之後，終端機會��行你輸入的指令，並且會從終端機的下一行開始輸出指令的��行結果。
  直到你看到新的 \`commander:~ $\` 出現時，代表你可以輸入下一個指令了。
  ��在請你輸入 \`echo hello\` 來看看會發生什麼事。`,
            },
          ],
          hints: ['��  在 `commander:~ $` ��面輸入 `echo hello` ��按下 Enter'],
        },
        {
          id: 'echo-hello',
          task: '在終端機輸入 `echo hello`',
          requirements: ['start'],
          condition: {
            command: ['^echo hello$'],
          },
          responses: [
            {
              content: `你應��可以看到終端機上��示了以下內容：
  \`\`\`
  commander:~ $ echo hello
  hello
  \`\`\`
  第一行的 \`commander:~ $\` 是命令提示字串，接在後方的 \`echo hello\` 是你輸入的指令。
  第二行的 \`hello\` ��是終端機的輸出結果。
  你現在知道了如何在終端機上輸入指令，以及查看終端機輸出的位置。
  ��在請輸入 \`echo next\` 來��續下一個步��。`,
            },
          ],
          hints: ['��  ���入 `echo next` ���續下一個步��'],
        },
        {
          id: 'echo-next',
          task: '在終端機輸入 `echo next`',
          requirements: ['echo-hello'],
          condition: {
            command: ['^echo next$'],
          },
          responses: [
            {
              content: `\`Ctrl + C\` 在終端機中是一個很重要的快捷鍵，它可以用來中��正在��行的指令，並產生一個新的命令提示字串，讓你可以��續輸入指令。
  如果指令��行很久沒有反應，或你因為其他原因想要中��指令，你可以按下 \`Ctrl + C\` 來中��指令。
  又或者你輸入了錯��的指令，����得慢慢��除，你也可以按下 \`Ctrl + C\` 來產生新的命令提示字串重新輸入指令。
  如果你已經理解了��才的說明，請輸入 \`echo finish\` 來結束這一關。`,
            },
          ],
          hints: [
            '��  ��下 `Ctrl + C` 能��中��正在��行的指令',
            '��  ��下 `Ctrl + C` 能��產生新的命令提示字串',
            '��  ���入 `echo finish` 來結束這一關',
          ],
        },
        {
          id: 'END',
          task: '結束關卡',
          requirements: ['echo-next'],
          condition: {
            command: ['^echo finish$'],
          },
          responses: [
            {
              content: '恭喜你完成了這個關卡！',
            },
          ],
        },
      ],
    }
    expect(questSchema.safeParse(sampleQuest).error).toBeUndefined()
  })
})
