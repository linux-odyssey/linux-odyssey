import { describe, it, expect } from '@jest/globals'
import { responseSchema } from '../src/quest/response.js'

describe('parsing response', () => {
  it('should parse valid response', () => {
    const response = {
      type: 'narrative',
      content: 'This is a response content',
    }
    const result = responseSchema.safeParse(response)
    expect(result.error).toBeUndefined()
  })

  it('should fail to parse invalid response', () => {
    const response = {
      type: 'dialogue',
      content: 'This is a response content',
    }
    const result = responseSchema.safeParse(response)
    expect(result.error).toBeUndefined()
  })
})
