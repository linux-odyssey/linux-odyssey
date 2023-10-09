import { User } from '@linux-odyssey/models'

// eslint-disable-next-line import/prefer-default-export
export function userCount() {
  return User.find().count()
}
