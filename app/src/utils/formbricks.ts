import formbricks from '@formbricks/js/website'
import useSession from '../store/session'
import useUserProfile from '../store/userProfile'

if (typeof window !== 'undefined') {
  formbricks.init({
    environmentId: 'clzcdqqml000gadvtpuckydzi',
    apiHost: 'https://app.formbricks.com',
  })
}

export function openQuestSurvey() {
  const sessionStore = useSession()
  const userStore = useUserProfile()

  formbricks.track('quest_completed', {
    hiddenFields: {
      quest: sessionStore.questId,
      session: sessionStore.session?._id,
      username: userStore.username,
      email: userStore.email,
    },
  })
}

export function openBugReport() {
  const sessionStore = useSession()
  const userStore = useUserProfile()

  formbricks.track('bug_report', {
    hiddenFields: {
      quest: sessionStore.questId,
      session: sessionStore.session?._id,
      username: userStore.username,
      email: userStore.email,
    },
  })
}

export default formbricks
