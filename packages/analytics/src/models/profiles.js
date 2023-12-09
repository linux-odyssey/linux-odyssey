/* eslint-disable object-shorthand */
/* eslint-disable func-names */
import { UserProfile } from '@linux-odyssey/models'

export function questCount() {
  return UserProfile.find().count()
}

export function questCompleted() {
  return UserProfile.find({
    $where: function () {
      for (const key in this.progress) {
        if (this.progress[key].completed === true) {
          return true
        }
      }
      return false
    },
  }).count()
}
