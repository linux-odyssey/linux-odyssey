<script setup lang="ts">
import ContactButton from '../components/ContactButton.vue'
import DynamicBackground from '../components/DynamicBackground.vue'
import LandingHeaderComponents from '../components/header/LandingHeaderComponents.vue'
import HeaderPart from '../components/header/HeaderPart.vue'

import { facebookUrl, githubUrl } from '../config'
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
                程式設計不僅僅是寫程式碼，還涉及到如何有效地與你的電腦互動。
                程式教育卻往往忽略背後「開發環境」的重要性，
                使得許多學生在過程中充滿挫折。
                「開發環境」是寫程式、執行程式過程所需要的一切工具。
                而這些工具需要在終端機輸入指令來使用。
                大部分的程式要用來運行的環境，並非 Windows 或 Mac OS，而是 Linux
                作業系統。 Linux Odyssey 即是為此設計的線上 Linux 互動教學網站。
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
                  初學者也能立即上手
                </h1>
                <h1 class="text-text p-2 col-span-2" style="font-size: 2.5vh">
                  我們明白對於初學者來說，設定和使用開發工具可能是一大障礙。
                  學習者無需安裝任何軟體，僅需通過瀏覽器即可連上一個真實的 Linux
                  環境。
                </h1>
              </div>
              <div
                class="bg-bg-primary p-5 rounded-xl opacity-90 grid grid-cols-3 grid-rows-2 justify-items-center items-center"
              >
                <h1
                  class="text-text-primary p-5 font-extrabold font-mono col-span-2"
                  style="font-size: 3.5vh"
                >
                  遊戲般的學習體驗
                </h1>
                <img src="../img/icon_sword.svg" class="h-[18vh] row-span-2" />
                <h1 class="text-text p-2 col-span-2" style="font-size: 2.5vh">
                  Linux Odyssey 融合了遊戲的樂趣與學習的實用性。
                  透過精心設計的遊戲關卡，學習者可以一邊接受挑戰、破解謎題，
                  一邊掌握 Linux 指令的運用。
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
                  真實的 Linux 操作之旅
                </h1>
                <h1 class="text-text p-2 col-span-2" style="font-size: 2.5vh">
                  Linux Odyssey 提供的不僅是理論知識，更是真實的操作體驗。
                  每一個指令都是在真實的 Linux 環境中執行，
                  讓學習者能夠真正深入軟體開發的世界。
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
                  準備好鍵盤，跟我們一起開啟你的 Linux 冒險吧！
                </div>
              </RouterLink>
            </section>
            <section
              id="about"
              class="text-text flex flex-col items-center mt-10 gap-10"
            >
              <div class="w-full flex flex-col items-center gap-2">
                <h1 class="text-text-primary text-3xl font-extrabold font-mono">
                  團隊介紹
                </h1>
                <p class="text-lg">國立臺北科技大學 智慧自動化工程科 第二屆</p>
                <div class="flex flex-row gap-5 justify-center">
                  <h1 class="font-bold">Wancat</h1>
                  <h1 class="font-bold">Neil</h1>
                  <h1 class="font-bold">A.H.</h1>
                  <h1 class="font-bold">Ray Gur</h1>
                </div>
              </div>
              <div class="w-full flex flex-col items-center gap-2">
                <h1 class="text-text-primary text-3xl font-extrabold font-mono">
                  得獎肯定
                </h1>
                <h1 class="text-xl text-center">
                  大專校院資訊應用服務創新競賽<br />
                  鈦坦敏捷開發特別獎 第二名
                </h1>
              </div>
              <div class="container mx-auto">
                <div
                  class="justify-items-center grid grid-cols-1 sm:grid-cols-3 gap-5"
                >
                  <h1
                    class="text-text-primary text-3xl font-extrabold font-mono sm:col-span-3 gap-6"
                  >
                    玩家感想
                    <!--可以做成翻頁卡牌一次一個-->
                  </h1>
                  <h1 class="text-xl text-center">"很好玩很像益智遊戲"</h1>
                  <h1 class="text-xl text-center">
                    "我從來不知道自由軟體的存在，謝謝你們。"
                  </h1>
                  <h1 class="text-xl text-center">
                    "還蠻好玩的，讓程式變好玩"
                  </h1>
                  <h1 class="text-xl text-center">
                    "以前不喜歡電腦課現在覺得喜歡一點點"
                  </h1>
                  <h1 class="text-xl text-center">
                    "程式真的對新手很友善，讓我學到了很多東西"
                  </h1>
                  <h1 class="text-xl text-center">
                    "感覺做得很好很簡明易懂關卡設計很用心"
                  </h1>
                  <h1 class="text-xl text-center">
                    "這個體驗我覺得非常有趣，可以體驗到沒辦法體驗的程式，學長也都熱心指導，非常感謝學長的用心的講解，希望以後還可以再體驗這種活動"
                  </h1>
                  <h1 class="text-xl text-center">
                    "以前我覺得寫程式很難不過現在覺得很有趣"
                  </h1>
                  <h1 class="text-xl text-center">
                    "以前覺得寫程式是我生活中碰不到而且很難的項目。但通過這堂課之後，覺得寫程式不再那麼難以親近"
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
              聯絡我們
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
