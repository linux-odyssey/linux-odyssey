<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useSession } from '../../store/session'
import { openBugReport, openQuestSurvey } from '../../utils/formbricks'

const { t } = useI18n()

const router = useRouter()
const sessionStore = useSession()
const reset = async () => {
  console.log('resetting...')
  await sessionStore.createSession()
}
const continuePlay = async () => {
  try {
    router.push({ name: 'map' })
  } catch (err) {
    useToast().error(t('quest_map.load_quest_map_failed'))
    console.error(err)
  }
}
</script>

<template>
  <section class="mt-2 flex flex-row gap-2 justify-center">
    <button
      id="survey"
      :title="t('game_nav.survey')"
      class="bg-bg-secondary rounded-lg p-2"
      @click="openQuestSurvey"
    >
      <font-awesome-icon
        :icon="['fas', 'file-invoice']"
        class="text-text-primary px-1"
      />
      <p class="text-text-primary text-xs">{{ t('game_nav.survey') }}</p>
    </button>
    <button
      id="bug-report"
      :title="t('game_nav.bug_report')"
      @click="openBugReport"
      class="bg-bg-secondary rounded-lg p-2"
    >
      <font-awesome-icon :icon="['fas', 'bug']" class="text-text-primary" />
      <p class="text-text-primary text-xs">
        {{ t('game_nav.bug_report') }}
      </p>
    </button>
    <!-- <button disabled id="solution" class="bg-bg-disabled rounded-lg p-2">
      <font-awesome-icon
        :icon="['far', 'circle-question']"
        class="text-text-disabled px-1"
      />
      <p class="text-text-disabled inline ml-1 md:flex">解答</p>
    </button> -->
    <button
      id="reset"
      :title="t('game.reset')"
      class="bg-bg-secondary rounded-lg p-2"
      @click="reset"
    >
      <font-awesome-icon
        :icon="['fas', 'arrow-rotate-left']"
        class="text-text-primary px-1"
      />
      <p class="text-text-primary text-xs">
        {{ t('game.reset') }}
      </p>
    </button>
    <button
      id="continue"
      :title="t('game.continue')"
      class="bg-bg-secondary rounded-lg p-2"
      @click="continuePlay"
    >
      <font-awesome-icon
        :icon="['far', 'circle-right']"
        class="text-text-primary px-1"
      />
      <p class="text-text-primary text-xs">
        {{ t('game.continue') }}
      </p>
    </button>
  </section>
</template>
