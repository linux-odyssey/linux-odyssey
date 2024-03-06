import { test, expect } from '@jest/globals'
import {
  CommandMatcher,
  ErrorMatcher,
  PwdMatcher,
  OutputMatcher,
  Condition,
} from '../src/condition'
import { Command } from '../src/command'

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

test('error matcher', () => {
  const matcher = new ErrorMatcher()
  expect(matcher.match({ error: '' })).toBe(true)
  expect(matcher.match({ error: 'permission denied' })).toBe(false)
})

test('error matcher with specific error', () => {
  const matcher = new ErrorMatcher('permission denied')
  expect(matcher.match({ error: '' })).toBe(false)
  expect(matcher.match({ error: 'file not found' })).toBe(false)
  expect(matcher.match({ error: 'cannot open files: permission denied' })).toBe(
    true
  )
})

test('pwd matcher', () => {
  const matcher = new PwdMatcher('/home/user')
  expect(matcher.match({ pwd: '/home/user' })).toBe(true)
  expect(matcher.match({ pwd: '/home/user1' })).toBe(false)
  expect(matcher.match({ pwd: '/home/user/anotherpath' })).toBe(false)
  expect(matcher.match({ pwd: '/var/home/user' })).toBe(false)
})

test('output matcher', () => {
  const matcher = new OutputMatcher('^start$')
  expect(matcher.match({ output: 'start' })).toBe(true)
  expect(matcher.match({ output: 'start1' })).toBe(false)
  expect(matcher.match({ output: 'start\n' })).toBe(true)
})

test('condition match', () => {
  const condition = new Condition({
    command: '^echo start$',
  })

  expect(
    condition.match({
      command: 'echo start',
    })
  ).toBe(true)
  expect(
    condition.match({
      command: 'echo hello',
    })
  ).toBe(false)
  expect(
    condition.match({ command: 'echo start', error: 'permission denied' })
  ).toBe(false)
})
