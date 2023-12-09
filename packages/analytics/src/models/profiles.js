/* eslint-disable object-shorthand */
/* eslint-disable func-names */
import { UserProfile } from '@linux-odyssey/models'

export function totalQuests() {
  return UserProfile.find().count()
}

export function totalCompleted() {
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

export function userProfileList() {
  return UserProfile.find()
}
