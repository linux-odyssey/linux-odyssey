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
  <div class="w-screen h-screen bg-scroll bg-bg">
    <DynamicBackground class="w-full h-full" />
    <div
      class="h-screen w-screen absolute top-0 left-0 flex flex-wrap justify-center content-center"
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
                Welcome to Linux Odyssey !
              </button>
            </div>
            <div class="h-full w-full flex gap-3 items-center justify-end">
              <button
                id="Intro"
                class="text-text inline-block font-bold whitespace-nowrap"
                @click="scrollToSection('intro')"
                style="font-size: 2vh"
              >
                Intro
              </button>
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

      <div class="w-fit h-[94vh] m-3 justify-center px-10 overflow-y-auto">
        <div
          class="w-full h-full grid grid-cols-3 justify-items-center items-center"
        >
          <h1
            class="text-text-primary mb-2 font-extrabold font-mono w-fit ml-20"
            style="font-size: 14vh"
          >
            Linux
          </h1>
          <img src="../img/icon_totem.svg" class="h-[30vh] inline-flex mr-12" />
          <h1
            class="text-text-primary mb-2 font-extrabold font-mono w-fit mr-20"
            style="font-size: 14vh"
          >
            Odyssey
          </h1>
        </div>
        <section
          id="intro"
          class="text-text p-5 grid grid-cols-1 gap-3 justify-items-center"
        >
          <h1 class="text-text inline-block">
            程式設計不僅僅是寫程式碼，還涉及到如何有效地與你的電腦互動。
          </h1>
          <h1 class="text-text inline-block">
            程式教育卻往往忽略背後「開發環境」的重要性，
            使得許多學生在過程中充滿挫折。
          </h1>
          <h1 class="text-text inline-block">
            「開發環境」是寫程式、執行程式過程所需要的一切工具。
            而這些工具需要在終端機輸入指令來使用。
          </h1>
          <h1 class="text-text inline-block">
            大部分的程式要用來運行的環境，並非 Windows 或 Mac OS，而是 Linux
            作業系統。
          </h1>
          <h1 class="text-text inline-block">
            Linux Odyssey 即是為此設計的線上 Linux 互動教學網站。
          </h1>
        </section>
        <section
          id="feature"
          class="text-text p-5 grid grid-cols-1 justify-items-center"
        >
          <h1
            class="text-text-primary p-5 font-extrabold font-mono"
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
            透過精心設計的遊戲關卡，學習者可以一邊接受挑戰、破解謎題， 一邊掌握
            Linux 指令的運用。
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
        <section
          id="start"
          class="text-text p-20 grid grid-cols-3 gap-10 justify-items-center"
        >
          <iframe
            width="1000"
            height="562"
            src="https://www.youtube.com/embed/XzvfmUf1QP8?si=QxnKJMNjsm27fGGF"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            class="col-span-3 pb-2 mb-3"
          ></iframe>

          <button
            id="StartGame"
            @click="handleSignIn"
            class="w-1/2 h-[10vh] bg-text-primary p-2 transition ease-in-out delay-130 hover:-translate-y-1 hover:scale-150 hover:bg-indigo-500 duration-300 col-span-3"
          >
            <div class="bg-black p-2 w-full">
              <div class="text-text p-2 w-full" style="font-size: 2.5vh">
                準備好鍵盤，跟我們一起開啟你的 Linux 冒險吧！
              </div>
            </div>
          </button>
        </section>
        <section
          id="info"
          class="text-text px-5 grid grid-cols-3 gap-2 justify-items-center"
        >
          <h1
            class="text-text-primary p-5 font-extrabold font-mono col-span-3"
            style="font-size: 3vh"
          >
            團隊介紹
          </h1>
          <h1 class="text-text p-2 col-span-3">
            國立臺北科技大學 智慧自動化工程科 第二屆 Linux Odyssey
            互動式終端機教學網站
          </h1>
          <h1 class="text-text p-2 col-span-3">Indieveloper</h1>
          <div class="p-2 col-span-3">
            <div class="grid grid-cols-4 gap-2 justify-items-center">
              <h1 class="font-bold">wancat 林貓</h1>
              <h1 class="font-bold">Neil</h1>
              <h1 class="font-bold">A.H.</h1>
              <h1 class="font-bold">Ray Gur</h1>
            </div>
          </div>
          <h1
            class="text-text-primary p-5 font-extrabold font-mono col-span-3"
            style="font-size: 3vh"
          >
            得獎肯定
          </h1>
          <h1 class="text-text p-2 col-span-3">
            大專校院資訊應用服務創新競賽 鈦坦敏捷開發特別獎 第二名
          </h1>

          <h1
            class="text-text-primary p-5 font-extrabold font-mono col-span-3"
            style="font-size: 3vh"
          >
            玩家感想
          </h1>
          <h1 class="text-text p-2">"很好玩很像益智遊戲"</h1>
          <h1 class="text-text p-2">
            "我從來不知道自由軟體的存在，謝謝你們。"
          </h1>
          <h1 class="text-text p-2">"還蠻好玩的，讓程式變好玩"</h1>
          <h1 class="text-text p-2">"以前不喜歡電腦課現在覺得喜歡一點點"</h1>
          <h1 class="text-text p-2">
            "程式真的對新手很友善，讓我學到了很多東西"
          </h1>
          <h1 class="text-text p-2">"感覺做得很好很簡明易懂關卡設計很用心"</h1>
          <h1 class="text-text p-2">
            "這個體驗我覺得非常有趣，可以體驗到沒辦法體驗的程式，學長也都熱心指導，非常感謝學長的用心的講解，希望以後還可以再體驗這種活動"
          </h1>
          <h1 class="text-text p-2">
            "以前我覺得寫程式很難不過現在覺得很有趣"
          </h1>
          <h1 class="text-text p-2">
            "以前覺得寫程式是我生活中碰不到而且很難的項目。但通過這堂課之後，覺得寫程式不再那麼難以親近"
          </h1>
        </section>
        <section
          id="contact"
          class="text-text p-5 grid grid-cols-3 gap-4 justify-items-center"
        >
          <h1
            class="text-text-primary p-5 font-extrabold font-mono col-span-3"
            style="font-size: 3vh"
          >
            聯絡我們
          </h1>
          <button title="facebookUrl" :href="facebookUrl" class="h-10 w-10">
            <font-awesome-icon
              :icon="['fab', 'facebook']"
              class="text-text-primary h-full w-full delay-130 hover:-translate-y-1 hover:scale-150"
            />
          </button>
          <button title="GitHubUrl" :href="GitHubUrl" class="h-10 w-10">
            <font-awesome-icon
              :icon="['fab', 'github']"
              class="text-text-primary h-full w-full delay-130 hover:-translate-y-1 hover:scale-150"
            />
          </button>
          <div title="EmailAddress" class="h-10 w-10">
            <font-awesome-icon
              :icon="['fas', 'envelope']"
              class="text-text-primary h-full w-full delay-130 hover:-translate-y-1 hover:scale-150"
            />
          </div>
          <h1 class="font-semibold">Facebook</h1>
          <h1 class="font-semibold">GitHub</h1>
          <h1 class="font-semibold">Email</h1>
          <h1>Linux Odyssey</h1>
          <h1>linux-odyssey/linux-odyssey</h1>
          <h1>team@linuxodyssey.xyz</h1>
        </section>
      </div>
    </div>
  </div>
</template>
