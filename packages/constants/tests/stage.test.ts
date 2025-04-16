import { describe, it, expect } from '@jest/globals'
import { stageSchema } from '../src/quest/stage.js'

describe('parsing stage', () => {
  it('should parse valid stage', () => {
    const stage = {
      id: 'start',
      task: '按下 `開始` ����開始',
      requirements: ['start'],
      condition: {
        command: ['^echo start$'],
      },
      responses: [
        {
          type: 'text',
          content: `在畫面的中下方的區��是終端機，你可以在終端機��輸入指令來操作電��。
  在終端機中，你所看到的 \`commander:~ $\` 叫做命令提示字串。
  ��令提示字串最後的��字號 \`$\` 叫命令提示符，你必須將指令輸入在它的後方。
  ��你輸入完指令並按下 Enter 之後，終端機會��行你輸入的指令，並且會從終端機的下一行開始輸出指令的��行結果。
  直到你看到新的 \`commander:~ $\` 出現時，代表你可以輸入下一個指令了。
  ��在請你輸入 \`echo hello\` 來看看會發生什麼事。`,
        },
      ],
      hints: ['��  在 `commander:~ $` ��面輸入 `echo hello` ��按下 Enter'],
    }
    const result = stageSchema.safeParse(stage)
    expect(result.error).toBeUndefined()
  })
})
