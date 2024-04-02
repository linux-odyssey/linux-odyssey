<!--Translated-->
<template>
  <section class="h-[10%] p-3 grid grid-cols-4 gap-4 place-content-between">
    <button id="survey" class="bg-bg-secondary rounded-lg p-2">
      <a title="Survey" :href="surveyUrl" target="_blank" class="h-5 w-5">
        <font-awesome-icon
          :icon="['fas', 'file-invoice']"
          class="text-text-primary"
        />
        <p class="text-text-primary inline ml-1">
          <!-- Survey -->
          {{ $t('controlPalette.survey') }}
        </p>
      </a>
    </button>
    <button disabled id="solution" class="bg-bg-disabled rounded-lg p-2">
      <font-awesome-icon
        :icon="['far', 'circle-question']"
        class="text-text-disabled"
      />
      <p class="text-text-disabled inline ml-1">
        <!-- Solution -->
        {{ $t('controlPalette.solution') }}
      </p>
    </button>
    <button id="reset" class="bg-bg-secondary rounded-lg p-2" @click="reset">
      <font-awesome-icon
        :icon="['fas', 'arrow-rotate-left']"
        class="text-text-primary"
      />
      <p class="text-text-primary inline ml-1">
        <!-- Reset -->
        {{ $t('controlPalette.reset') }}
      </p>
    </button>
    <button
      id="continue"
      class="bg-bg-secondary rounded-lg p-2"
      @click="continuePlay"
    >
      <font-awesome-icon
        :icon="['far', 'circle-right']"
        class="text-text-primary"
      />
      <p class="text-text-primary inline ml-1">
        <!-- Continue -->
        {{ $t('controlPalette.continue') }}
      </p>
    </button>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { createSession } from '../store/session'
import { surveyUrl } from '../config'
import i18next from 'i18next'

const router = useRouter()
const reset = async () => {
  console.log('resetting...')
  await createSession()
}
const continuePlay = async () => {
  try {
    router.push({ name: 'map' })
  } catch (err) {
    // useToast().error('Failed to load map')
    useToast().error(i18next.t('header.errorLoadMap'))
    console.error(err)
  }
}
</script>
