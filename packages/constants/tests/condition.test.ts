import { describe, it, expect } from '@jest/globals'
import { conditionSchema } from '../src/index.js'

describe('parsing condition', () => {
  it('should parse condition', () => {
    const condition = {
      command: ['^echo start$'],
      output: ['^start$'],
    }
    const result = conditionSchema.safeParse(condition)
    expect(result.error).toBeUndefined()
  })
})
