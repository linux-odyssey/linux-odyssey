<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import useSession from '../../store/session'
import { openBugReport, openQuestSurvey } from '../../utils/formbricks'

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
    useToast().error('無法讀取地圖')
    console.error(err)
  }
}
</script>

<template>
  <section class="mt-2 flex flex-row gap-3 justify-center">
    <button
      id="survey"
      class="bg-bg-secondary rounded-lg p-2"
      @click="openQuestSurvey"
    >
      <font-awesome-icon
        :icon="['fas', 'file-invoice']"
        class="text-text-primary px-1"
      />
      <p class="text-text-primary inline md:flex">問卷</p>
    </button>
    <button
      title="Bug Report"
      @click="openBugReport"
      class="bg-bg-secondary rounded-lg p-2"
    >
      <font-awesome-icon :icon="['fas', 'bug']" class="text-text-primary" />
      <p class="text-text-primary inline ml-1 md:flex">回報</p>
    </button>
    <!-- <button disabled id="solution" class="bg-bg-disabled rounded-lg p-2">
      <font-awesome-icon
        :icon="['far', 'circle-question']"
        class="text-text-disabled px-1"
      />
      <p class="text-text-disabled inline ml-1 md:flex">解答</p>
    </button> -->
    <button id="reset" class="bg-bg-secondary rounded-lg p-2" @click="reset">
      <font-awesome-icon
        :icon="['fas', 'arrow-rotate-left']"
        class="text-text-primary px-1"
      />
      <p class="text-text-primary inline ml-1 md:flex">重來</p>
    </button>
    <button
      id="continue"
      class="bg-bg-secondary rounded-lg p-2"
      @click="continuePlay"
    >
      <font-awesome-icon
        :icon="['far', 'circle-right']"
        class="text-text-primary px-1"
      />
      <p class="text-text-primary inline ml-1 md:flex">繼續</p>
    </button>
  </section>
</template>
