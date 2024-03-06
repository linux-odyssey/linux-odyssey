import { test, expect } from '@jest/globals'
import {
  PatternMatcher,
  CommandMatcher,
  ErrorMatcher,
  PwdMatcher,
  Condition,
} from '../src/condition'
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

// test('condition match', () => {
//   const condition = new Condition({
//     command: '^echo start$',
//     pwd: '/home/user',
//   })

//   expect(
//     condition.match({
//       command: 'echo start',
//       pwd: '/home/user',
//     })
//   ).toBe(true)
//   expect(
//     condition.match({
//       command: 'echo start',
//       pwd: '/home/user1',
//     })
//   ).toBe(false)
// })
