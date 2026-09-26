<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { bugReportUrl } from '../../config'

const { t } = useI18n()

const scrollToSection = (sectionId: string) => {
  const section = document.getElementById(sectionId)
  if (section) {
    const container = document.querySelector('.overflow-y-auto') as HTMLElement // Replace '.overflow-y-auto' with the appropriate class or selector for your container
    if (container) {
      container.scrollTo({
        top: section.offsetTop - container.offsetTop,
        behavior: 'smooth', // Add smooth scrolling behavior if desired
      })
    }
  }
}
</script>
<template>
  <button
    id="Intro"
    class="text-text inline-block font-bold whitespace-nowrap pt-1 px-2 hover:text-text-primary"
    @click="scrollToSection('intro')"
    style="font-size: 2vh"
  >
    {{ t('landing_nav.intro') }}
  </button>

  <button
    id="Feature"
    class="text-text inline-block font-bold whitespace-nowrap pt-1 px-2 hover:text-text-primary"
    @click="scrollToSection('feature')"
    style="font-size: 2vh"
  >
    {{ t('landing_nav.features') }}
  </button>

  <button
    id="Info"
    class="text-text inline-block font-bold whitespace-nowrap pt-1 px-2 hover:text-text-primary"
    @click="scrollToSection('about')"
    style="font-size: 2vh"
  >
    {{ t('landing_nav.about') }}
  </button>

  <button
    id="Contact"
    class="text-text inline-block font-bold whitespace-nowrap pt-1 px-2 hover:text-text-primary"
    @click="scrollToSection('contact')"
    style="font-size: 2vh"
  >
    {{ t('landing_nav.contact') }}
  </button>

  <RouterLink
    id="SignIn"
    to="/register"
    class="text-text inline-block font-bold whitespace-nowrap pt-1 px-2 hover:text-text-primary"
    style="font-size: 2vh"
  >
    {{ t('landing_nav.login') }}
  </RouterLink>

  <a
    :title="t('landing_nav.report_bug')"
    :href="bugReportUrl"
    target="_blank"
    class="h-5 w-5"
  >
    <font-awesome-icon
      :icon="['fas', 'bug']"
      class="text-text inline-block font-bold whitespace-nowrap pt-1 px-2 hover:text-text-primary"
    />
  </a>
</template>
