<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { ref} from 'vue'
import { Vue3Lottie } from 'vue3-lottie'
// import { surveyUrl } from '../config'
import CompleteAnimation from '../../img/complete-animation.json'
import formbricks from "@formbricks/js/website";


formbricks.init({
  environmentId: "clyffbuq50bbxwh63thlfs1lb", 
  apiHost: "https://app.formbricks.com",
  attributes: {
    language: "zh", // optional
  },
});

const showModal = ref(true) // Controls whether the modal is visible or not
const router = useRouter()
const toast = useToast()

if (typeof window !== "undefined") {
  formbricks.init({
    environmentId: "clyffbuq50bbxwh63thlfs1lb", 
    apiHost: "https://app.formbricks.com",
  });
}

const closeModal = () => {
  showModal.value = false
}

const defineComponent = () => ({
  components: {
    Vue3Lottie,
  },
  setup() {
    return {
      CompleteAnimation,
    }
  },
})

const backtoMap = async () => {
  try {
    router.push({ name: 'map' })
  } catch (err) {
    toast.error('無法讀取地圖')
    console.error(err)
  }
}

// Simulate completing a quest to show the modal
setTimeout(() => {
  showModal.value = true
}, 5000) // Show modal after 5 seconds

</script>

<template>
  <div v-if="showModal" class="modal">
    <div class="modal-content bg-bg-secondary rounded-lg">
      <span class="close text-text" @click="closeModal">&times;</span>

      <h2
        id="QuestCompleted"
        class="text-2xl text-text mb-5 w-full inline-flex justify-center"
      >
        關卡完成！
      </h2>
      <div class="z-10 right-1/2 top-1/2" @animationend="defineComponent">
        <Vue3Lottie
          :animationData="CompleteAnimation"
          :height="200"
          :width="200"
        />
      </div>
      <p class="text-base text-text text-center">恭喜你完成這一關！</p>
      <p class="text-base text-text text-center">
        接下來回到地圖，迎接新的挑戰吧！
      </p>
      <a
        id="BacktoMap"
        target="_blank"
        @click="backtoMap"
        class="inline-flex justify-center rounded-lg text-base font-black py-2 mt-3 bg-text-primary w-full"
        >回到地圖</a
      >
    </div>
  </div>
</template>

<style scoped>
.modal {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1;
}

.modal-content {
  position: relative;
  margin: 15% auto;
  padding: 20px;
  width: 30%;
}

.close {
  position: absolute;
  top: 0;
  right: 10px;
  font-size: 30px;
  cursor: pointer;
}
</style>
