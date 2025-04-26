import { test, expect } from '@jest/globals'
import { isValidEmail, isValidUsername } from '../auth'

test('check valid username', () => {
  const valid = ['alex', 'alex123', 'john_doe', 'john-doe', 'rudeus']

  const invalid = ['root', 'admin', '12michael', 'Justin', 'testUser']

  valid.forEach((username) => {
    expect(isValidUsername(username)).toBe(true)
  })

  invalid.forEach((username) => {
    expect(isValidUsername(username)).toBe(false)
  })
})

test('check valid email', () => {
  const validEmails = [
    'user@example.com',
    'user.name@example.co.uk',
    'user1234@email.domain',
    'user+tag@example.net',
    'user@subdomain.example.com',
    'user@123.45.67.89',
  ]

  const invalidEmails = [
    'user@.com',
    '@example.com',
    'user@-invalid-domain.com',
    'user@.123',
    'user@.123.45.67',
  ]

  validEmails.forEach((email) => {
    expect(isValidEmail(email)).toBe(true)
  })

  invalidEmails.forEach((email) => {
    expect(isValidEmail(email)).toBe(false)
  })
})
