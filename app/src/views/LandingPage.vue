<script setup lang="ts">
import ContactButton from '../components/ContactButton.vue'
import DynamicBackground from '../components/DynamicBackground.vue'
import LandingHeaderComponents from '../components/header/LandingHeaderComponents.vue'
import HeaderPart from '../components/header/HeaderPart.vue'

import { facebookUrl, githubUrl } from '../config'
import { i18next } from '../i18n'

const { t } = i18next
</script>
<template>
  <div class="w-screen h-screen bg-scroll bg-bg">
    <DynamicBackground class="w-full h-full" />
    <div class="h-screen w-screen absolute top-0 left-0">
      <!-- game header -->
      <HeaderPart :headerComponent="LandingHeaderComponents" class="z-50" />
      <!-- main content -->
      <main class="w-full h-full overflow-y-auto">
        <div class="w-full flex flex-col items-center">
          <div
            class="flex flex-col md:flex-row mt-10 justify-around gap-5 items-center my-10"
          >
            <h1 class="text-text-primary text-7xl font-extrabold font-mono">
              Linux
            </h1>
            <img src="../img/icon_totem.svg" class="h-[30vh]" />
            <h1 class="text-text-primary text-7xl font-extrabold font-mono">
              Odyssey
            </h1>
          </div>
          <!-- intro -->
          <div class="w-full md:w-2/3 px-5">
            <section
              id="intro"
              class="text-text grid grid-cols-1 gap-3 justify-items-center"
            >
              <h1
                class="text-text inline-block bg-bg-primary p-5 rounded-xl opacity-90"
                style="font-size: 2.5vh"
              >
                {{ t('landingPage.intro') }}
              </h1>
            </section>
            <section
              id="feature"
              class="text-text p-15 grid grid-rows-3 gap-10 items-center pt-10"
            >
              <div
                class="bg-bg-primary p-5 rounded-xl opacity-90 grid grid-cols-3 grid-rows-2 justify-items-center items-center"
              >
                <img
                  src="../img/icon_shuttle.svg"
                  class="h-[18vh] row-span-2"
                />
                <h1
                  class="text-text-primary p-5 font-extrabold font-mono col-span-2"
                  style="font-size: 3.5vh"
                >
                  {{ t('landingPage.feature.beginner.title') }}
                </h1>
                <h1 class="text-text p-2 col-span-2" style="font-size: 2.5vh">
                  {{ t('landingPage.feature.beginner.description') }}
                </h1>
              </div>
              <div
                class="bg-bg-primary p-5 rounded-xl opacity-90 grid grid-cols-3 grid-rows-2 justify-items-center items-center"
              >
                <h1
                  class="text-text-primary p-5 font-extrabold font-mono col-span-2"
                  style="font-size: 3.5vh"
                >
                  {{ t('landingPage.feature.gamified.title') }}
                </h1>
                <img src="../img/icon_sword.svg" class="h-[18vh] row-span-2" />
                <h1 class="text-text p-2 col-span-2" style="font-size: 2.5vh">
                  {{ t('landingPage.feature.gamified.description') }}
                </h1>
              </div>
              <div
                class="bg-bg-primary p-5 rounded-xl opacity-90 grid grid-cols-3 grid-rows-2 justify-items-center items-center"
              >
                <img
                  src="../img/icon_settings.svg"
                  class="h-[18vh] row-span-2"
                />
                <h1
                  class="text-text-primary p-5 font-extrabold font-mono col-span-2 pt-8"
                  style="font-size: 3.5vh"
                >
                  {{ t('landingPage.feature.real_experience.title') }}
                </h1>
                <h1 class="text-text p-2 col-span-2" style="font-size: 2.5vh">
                  {{ t('landingPage.feature.real_experience.description') }}
                </h1>
              </div>
            </section>
            <section class="w-full py-10">
              <iframe
                src="https://www.youtube.com/embed/XzvfmUf1QP8?si=QxnKJMNjsm27fGGF"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
                class="w-full aspect-video"
              ></iframe>
            </section>
            <section
              id="start"
              class="text-text bg-bg-secondary border-8 border-text-tertiary rounded-xl transition ease-in-out hover:scale-110 duration-300"
            >
              <RouterLink title="StartGame" id="StartGame" to="/register">
                <div class="text-text text-xl p-2 w-full text-center">
                  {{ t('landingPage.start') }}
                </div>
              </RouterLink>
            </section>
            <section
              id="about"
              class="text-text flex flex-col items-center mt-10 gap-10"
            >
              <div class="w-full flex flex-col items-center gap-2">
                <h1 class="text-text-primary text-3xl font-extrabold font-mono">
                  {{ t('landingPage.team.title') }}
                </h1>
                <p class="text-lg">
                  {{ t('landingPage.team.description') }}
                </p>
                <div class="flex flex-row gap-5 justify-center">
                  <h1 class="font-bold">Wancat</h1>
                  <h1 class="font-bold">Neil</h1>
                  <h1 class="font-bold">A.H.</h1>
                  <h1 class="font-bold">Ray Gur</h1>
                </div>
              </div>
              <div class="w-full flex flex-col items-center gap-2">
                <h1 class="text-text-primary text-3xl font-extrabold font-mono">
                  {{ t('landingPage.awards.title') }}
                </h1>
                <h1 class="text-xl text-center">
                  {{ t('landingPage.awards.description') }}
                </h1>
              </div>
              <div class="container mx-auto">
                <div
                  class="justify-items-center grid grid-cols-1 sm:grid-cols-3 gap-5"
                >
                  <h1
                    class="text-text-primary text-3xl font-extrabold font-mono sm:col-span-3 gap-6"
                  >
                    {{ t('landingPage.playerFeedback.title') }}
                    <!--可以做成翻頁卡牌一次一個-->
                  </h1>
                  <h1 class="text-xl text-center" v-for="i in 9" :key="i">
                    {{ t(`landingPage.playerFeedback.feedbacks.${i - 1}`) }}
                  </h1>
                </div>
              </div>
            </section>
          </div>
          <section
            id="contact"
            class="text-text mt-10 flex flex-col items-center"
          >
            <h1 class="text-text-primary font-extrabold font-mono text-3xl">
              {{ t('landingPage.contact.title') }}
            </h1>
            <div
              class="flex flex-row items-center justify-around mt-5 gap-5 mb-5"
            >
              <ContactButton
                :url="facebookUrl"
                :icons="['fab', 'facebook']"
                title="Facebook"
                desciption="Linux Odyssey"
              />
              <ContactButton
                :url="githubUrl"
                :icons="['fab', 'github']"
                title="GitHub"
                desciption="linux-odyssey/linux-odyssey"
              />
              <ContactButton
                url="mailto:team@linuxodyssey.xyz"
                :icons="['fas', 'envelope']"
                title="Email"
                desciption="team@linuxodyssey.xyz"
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>
