<script setup>
// import { computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import DynamicBackground from '../components/DynamicBackground.vue'

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
                Welcome to Linux Odyssey!
              </button>
            </div>
            <div class="h-full w-full flex gap-3 items-center justify-end">
              <button
                id="Info"
                class="text-text inline-block font-bold whitespace-nowrap"
                @click="scrollToSection('info')"
                style="font-size: 2vh"
              >
                Info
              </button>
              <button
                id="Feature"
                class="text-text inline-block font-bold whitespace-nowrap"
                @click="scrollToSection('feature')"
                style="font-size: 2vh"
              >
                Feature
              </button>
              <button
                id="Contact"
                class="text-text inline-block font-bold whitespace-nowrap"
                @click="scrollToSection('contact')"
                style="font-size: 2vh"
              >
                Contact
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

      <div class="w-fit h-[94vh] m-3 justify-center px-10">
        <h1
          class="text-text-primary mb-5 font-extrabold font-mono"
          style="font-size: 16vh"
        >
          Linux Odyssey
        </h1>
        <div class="overflow-y-auto w-70% flex flex-col">
          <section id="info" class="text-text mb-5">
            Contrary to popular belief, Lorem Ipsum is not simply random text.
            It has roots in a piece of classical Latin literature from 45 BC,
            making it over 2000 years old. Richard McClintock, a Latin professor
            at Hampden-Sydney College in Virginia, looked up one of the more
            obscure Latin words, consectetur, from a Lorem Ipsum passage, and
            going through the cites of the word in classical literature,
            discovered the undoubtable source. Lorem Ipsum comes from sections
            1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes
            of Good and Evil) by Cicero, written in 45 BC. This book is a
            treatise on the theory of ethics, very popular during the
            Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit
            amet..", comes from a line in section 1.10.32. //Contrary to popular
            belief, Lorem Ipsum is not simply random text. It has roots in a
            piece of classical Latin literature from 45 BC, making it over 2000
            years old. Richard McClintock, a Latin professor at Hampden-Sydney
            College in Virginia, looked up one of the more obscure Latin words,
            consectetur, from a Lorem Ipsum passage, and going through the cites
            of the word in classical literature, discovered the undoubtable
            source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de
            Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by
            Cicero, written in 45 BC. This book is a treatise on the theory of
            ethics, very popular during the Renaissance. The first line of Lorem
            Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section
            1.10.32.
          </section>
          <section id="feature" class="text-text mb-5">
            There are many variations of passages of Lorem Ipsum available, but
            the majority have suffered alteration in some form, by injected
            humour, or randomised words which don't look even slightly
            believable. If you are going to use a passage of Lorem Ipsum, you
            need to be sure there isn't anything embarrassing hidden in the
            middle of text. All the Lorem Ipsum generators on the Internet tend
            to repeat predefined chunks as necessary, making this the first true
            generator on the Internet. It uses a dictionary of over 200 Latin
            words, combined with a handful of model sentence structures, to
            generate Lorem Ipsum which looks reasonable. The generated Lorem
            Ipsum is therefore always free from repetition, injected humour, or
            non-characteristic words etc.//There are many variations of passages
            of Lorem Ipsum available, but the majority have suffered alteration
            in some form, by injected humour, or randomised words which don't
            look even slightly believable. If you are going to use a passage of
            Lorem Ipsum, you need to be sure there isn't anything embarrassing
            hidden in the middle of text. All the Lorem Ipsum generators on the
            Internet tend to repeat predefined chunks as necessary, making this
            the first true generator on the Internet. It uses a dictionary of
            over 200 Latin words, combined with a handful of model sentence
            structures, to generate Lorem Ipsum which looks reasonable. The
            generated Lorem Ipsum is therefore always free from repetition,
            injected humour, or non-characteristic words etc.
          </section>
          <div class="justify-self-center w-fit">
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

        <section id="contact" class="text-text mb-5">
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout. The point of
          using Lorem Ipsum is that it has a more-or-less normal distribution of
          letters, as opposed to using 'Content here, content here', making it
          look like readable English. Many desktop publishing packages and web
          page editors now use Lorem Ipsum as their default model text, and a
          search for 'lorem ipsum' will uncover many web sites still in their
          infancy. Various versions have evolved over the years, sometimes by
          accident, sometimes on purpose (injected humour and the like).//It is
          a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout. The point of
          using Lorem Ipsum is that it has a more-or-less normal distribution of
          letters, as opposed to using 'Content here, content here', making it
          look like readable English. Many desktop publishing packages and web
          page editors now use Lorem Ipsum as their default model text, and a
          search for 'lorem ipsum' will uncover many web sites still in their
          infancy. Various versions have evolved over the years, sometimes by
          accident, sometimes on purpose (injected humour and the like).
        </section>
      </div>
    </div>
  </div>
</template>
