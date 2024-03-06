import { test, expect } from '@jest/globals'
import { PatternMatcher, CommandMatcher, ErrorMatcher } from '../src/condition'
import { Command } from '../src/command'

test('pattern match', () => {
  const matcher = new PatternMatcher('^echo start$')

  expect(matcher.test('echo start')).toBe(true)
  expect(matcher.test('echo start ')).toBe(false)
})

test('pattern match with flag', () => {
  const matcher = new PatternMatcher('^echo start$', 'i')

  expect(matcher.test('echo start')).toBe(true)
  expect(matcher.test('echo Start')).toBe(true)
  expect(matcher.test('echo Start ')).toBe(false)
})

test('empty pattern return true', () => {
  const matcher = new PatternMatcher('')
  expect(matcher.test('echo start')).toBe(true)
})

test('empty error return false', () => {
  const matcher = new ErrorMatcher()
  expect(matcher.match({ error: '' })).toBe(true)
  expect(matcher.match({ error: 'permission denied' })).toBe(false)
})

test('command match', () => {
  const command: Command = {
    command: 'echo start',
    output: 'start',
    error: '',
    pwd: '/home/user',
  }

  const matcher = new CommandMatcher('^echo start$', 'i')
  expect(matcher.match(command)).toBe(true)
})

test('condition match', () => {})
