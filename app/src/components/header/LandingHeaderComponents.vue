<script setup>
import { bugReportUrl } from '../../config'

const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId)
  if (section) {
    const container = document.querySelector('.overflow-y-auto') // Replace '.overflow-y-auto' with the appropriate class or selector for your container
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
    class="text-text inline-block font-bold whitespace-nowrap pt-1"
    @click="scrollToSection('intro')"
    style="font-size: 2vh"
  >
    前言
  </button>
  <button
    id="Feature"
    class="text-text inline-block font-bold whitespace-nowrap pt-1"
    @click="scrollToSection('feature')"
    style="font-size: 2vh"
  >
    特色</button
  ><button
    id="Info"
    class="text-text inline-block font-bold whitespace-nowrap pt-1"
    @click="scrollToSection('about')"
    style="font-size: 2vh"
  >
    關於
  </button>

  <button
    id="Contact"
    class="text-text inline-block font-bold whitespace-nowrap pt-1"
    @click="scrollToSection('contact')"
    style="font-size: 2vh"
  >
    聯絡我們
  </button>
  <RouterLink
    title="Sign In"
    id="SignIn"
    to="/register"
    class="text-text inline-block font-bold whitespace-nowrap pt-1"
    style="font-size: 2vh"
  >
    登入
  </RouterLink>
  <a title="Bug Report" :href="bugReportUrl" target="_blank" class="h-5 w-5">
    <font-awesome-icon
      :icon="['fas', 'bug']"
      class="text-text-primary h-full w-full"
    />
  </a>
</template>
