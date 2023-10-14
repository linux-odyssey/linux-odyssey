export function isValidUsername(username) {
  // Define a regular expression pattern for a valid Linux username.
  const usernamePattern = /^[a-z][a-z0-9_-]*$/

  // Test the username against the pattern.
  if (!usernamePattern.test(username))
    return {
      validation: false,
      reason: 'Start with or contain capitals or special letters except _ or -',
    }

  // check if the username is between 1 and 32 characters
  if (username.length < 4 || username.length > 32) {
    return {
      validation: false,
      reason: 'Username length less than 4 letters or greater than 32 letters',
    }
  }

  const reservedWords = [
    'root',
    'admin',
    'administrator',
    'sysadmin',
    'system',
    'daemon',
    'bin',
    'nobody',
    'nogroup',
    'guest',
    'user',
  ]
  if (reservedWords.includes(username)) {
    return { validation: false, reason: 'Contains reserved words' }
  }
  return { validation: true, reason: '' }
}

export function isValidEmail(email) {
  // Define a regular expression pattern for a valid email address.
  const emailPattern = /^[\w-.+]+@([\w][\w-]*\.)+[\w-]{2,}$/

  // Test the email against the pattern.
  return emailPattern.test(email)
}
