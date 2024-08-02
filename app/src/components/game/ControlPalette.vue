<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import useSession from '../../store/session'
import { surveyUrl } from '../../config'
import formbricks from '../../utils/formbricks'

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
  <section
    class="h-fit w-fit px-1 py-1 grid grid-cols-4 gap-2 place-content-between"
  >
    <button id="survey" class="bg-bg-secondary rounded-lg p-2">
      <a title="Survey" :href="surveyUrl" target="_blank" class="h-5 w-5">
        <font-awesome-icon
          :icon="['fas', 'file-invoice']"
          class="text-text-primary px-1"
        />
        <p class="text-text-primary inline ml-1 md:flex">問卷</p>
      </a>
    </button>
    <button
      id="solution"
      class="bg-bg-disabled rounded-lg p-2"
      @click="formbricks.track('quest_completed')"
    >
      <font-awesome-icon
        :icon="['far', 'circle-question']"
        class="text-text-disabled px-1"
      />
      <p class="text-text-disabled inline ml-1 md:flex">解答</p>
    </button>
    <button id="reset" class="bg-bg-secondary rounded-lg p-2" @click="reset">
      <font-awesome-icon
        :icon="['fas', 'arrow-rotate-left']"
        class="text-text-primary px-1"
      />
      <p class="text-text-primary inline ml-1 hidden md:flex">重來</p>
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
      <p class="text-text-primary inline ml-1 hidden md:flex">繼續</p>
    </button>
  </section>
</template>
