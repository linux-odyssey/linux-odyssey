<script setup>
// import { computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import DynamicBackground from '../components/DynamicBackground.vue'
import { bugReportUrl, facebookUrl, GitHubUrl } from '../config'

const router = useRouter()
const toast = useToast()

const handleSignIn = async () => {
  try {
    router.push({ name: 'login' })
  } catch (err) {
    toast.error('無法讀取登入頁面')
    console.log(err)
  }
}

const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId)
  if (section) {
    window.scrollTo({
      top: section.offsetTop,
      behavior: 'smooth',
    })
  }
}
</script>
<template>
  <div class="w-screen h-screen bg-scroll bg-bg">
    <DynamicBackground class="overflow-auto w-full h-full" />
    <div
      class="overflow-auto h-screen w-screen absolute top-0 left-0 flex flex-wrap justify-center content-center"
    >
      <!-- game header -->
      <div class="h-[6vh] w-full">
        <div
          id="header"
          class="bg-bg-secondary content-center h-full w-full p-1 items-center"
        >
          <div class="h-full flex items-center justify-center mx-3">
            <div class="flex items-center gap-3">
              <img src="../img/icon_totem.svg" class="h-5" />
              <button
                id="GameTitle"
                class="text-text-primary inline-block font-bold whitespace-nowrap"
                style="font-size: 2vh"
              >
                Welcome to Linux Odyssey!
              </button>
            </div>
            <div class="h-full w-full flex gap-3 items-center justify-end">
              <button
                id="Feature"
                class="text-text inline-block font-bold whitespace-nowrap"
                @click="scrollToSection('feature')"
                style="font-size: 2vh"
              >
                Feature</button
              ><button
                id="Info"
                class="text-text inline-block font-bold whitespace-nowrap"
                @click="scrollToSection('info')"
                style="font-size: 2vh"
              >
                Info
              </button>

              <button
                id="Contact"
                class="text-text inline-block font-bold whitespace-nowrap"
                @click="scrollToSection('contact')"
                style="font-size: 2vh"
              >
                Contact Us
              </button>

              <button
                title="Sign In"
                @click="handleSignIn"
                class="text-text inline-block font-bold whitespace-nowrap"
                style="font-size: 2vh"
              >
                Sign In
              </button>
              <a
                title="Bug Report"
                :href="bugReportUrl"
                target="_blank"
                class="h-5 w-5"
              >
                <font-awesome-icon
                  :icon="['fas', 'bug']"
                  class="text-text-primary h-full w-full"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="w-fit h-[94vh] m-3 justify-center px-10 overflow-auto">
        <div class="w-full">
          <h1
            class="text-text-primary mb-2 font-extrabold font-mono w-fit"
            style="font-size: 16vh"
          >
            Linux
          </h1>
          <img src="../img/icon_totem.svg" class="h-[30vh]" />
          <h1
            class="text-text-primary mb-2 font-extrabold font-mono w-fit"
            style="font-size: 16vh"
          >
            Odyssey
          </h1>
        </div>
        <div class="overflow-y-auto w-70% flex flex-col">
          <section id="intro" class="text-text p-5">
            <h1 class="text-text inline-block font-bold whitespace-nowrap p-2">
              程式設計不僅僅是寫程式碼，還涉及到如何有效地與你的電腦互動。
            </h1>
            <br />
            <h1 class="text-text inline-block font-bold whitespace-nowrap p-2">
              程式教育卻往往忽略背後「開發環境」的重要性，
              使得許多學生在過程中充滿挫折。
            </h1>
            <br />
            <h1 class="text-text inline-block font-bold whitespace-nowrap p-2">
              「開發環境」是寫程式、執行程式過程所需要的一切工具。
              而這些工具需要在終端機輸入指令來使用。
            </h1>
            <br />
            <h1 class="text-text inline-block font-bold whitespace-nowrap p-2">
              大部分的程式要用來運行的環境，並非 Windows 或 Mac OS，而是 Linux
              作業系統。
            </h1>
            <br />
            <h1 class="text-text inline-block font-bold whitespace-nowrap p-2">
              Linux Odyssey 即是為此設計的線上 Linux 互動教學網站。
            </h1>
          </section>
          <section id="feature" class="text-text p-5">
            <h1
              class="text-text-primary px-5 font-extrabold font-mono"
              style="font-size: 3vh"
            >
              初學者也能立即上手
            </h1>
            <h1 class="text-text p-2" style="font-size: 2vh">
              我們明白對於初學者來說，設定和使用開發工具可能是一大障礙。
            </h1>
            <h1 class="text-text p-2" style="font-size: 2vh">
              學習者無需安裝任何軟體，僅需通過瀏覽器即可連上一個真實的 Linux
              環境。
            </h1>
            <h1
              class="text-text-primary p-5 font-extrabold font-mono"
              style="font-size: 3vh"
            >
              遊戲般的學習體驗
            </h1>
            <h1 class="text-text p-2" style="font-size: 2vh">
              Linux Odyssey 融合了遊戲的樂趣與學習的實用性。
            </h1>
            <h1 class="text-text p-2" style="font-size: 2vh">
              透過精心設計的遊戲關卡，學習者可以一邊接受挑戰、破解謎題，
              一邊掌握 Linux 指令的運用。
            </h1>
            <h1
              class="text-text-primary p-5 font-extrabold font-mono"
              style="font-size: 3vh"
            >
              真實的 Linux 操作之旅
            </h1>
            <h1 class="text-text p-2" style="font-size: 2vh">
              Linux Odyssey 提供的不僅是理論知識，更是真實的操作體驗。
            </h1>
            <h1 class="text-text p-2" style="font-size: 2vh">
              每一個指令都是在真實的 Linux 環境中執行，
              讓學習者能夠真正深入軟體開發的世界。
            </h1>
          </section>
          <div class="justify-self-center w-fit p-4">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/XzvfmUf1QP8?si=QxnKJMNjsm27fGGF"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
        </div>
        <section id="feature" class="text-text px-5"></section>
        <button
          id="StartGame"
          @click="handleSignIn"
          class="w-1/14 h-1/10 bg-text-primary p-1"
        >
          <div class="bg-black">
            <div class="text-text p-2 justify-center">
              準備好鍵盤，跟我們一起開啟你的 Linux 冒險吧！
            </div>
          </div>
        </button>
        <section id="contact" class="text-text px-5">
          <button title="facebookUrl" :href="facebookUrl" class="h-10 w-10">
            <font-awesome-icon
              :icon="['fab', 'facebook']"
              class="text-text-primary h-full w-full"
            />
          </button>
          facebook粉絲專頁: Linux Odyssey
          <button title="GitHubUrl" :href="GitHubUrl" class="h-10 w-10">
            <font-awesome-icon
              :icon="['fab', 'github']"
              class="text-text-primary h-full w-full"
            /></button
          >Github: linux-odyssey/linux-odyssey
          <div title="EmailAddress" class="h-10 w-10">
            <font-awesome-icon
              :icon="['fas', 'envelope']"
              class="text-text-primary h-full w-full"
            />
          </div>
          email: team@linuxodyssey.xyz
        </section>
      </div>
    </div>
  </div>
</template>
