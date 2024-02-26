<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { ref } from 'vue'
import { Vue3Lottie } from 'vue3-lottie'
// import { surveyUrl } from '../config'
import CompleteAnimation from '../img/complete-animation.json'

const showModal = ref(true) // Controls whether the modal is visible or not
const router = useRouter()
const toast = useToast()
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
    // useToast().error('Failed to load map')
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
        <!-- Quest Completed! -->
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
      <!-- <p class="text-base text-text">
        您已成功完成挑戰，真的非常感謝您的參與！<br />
        如果您能撥冗填寫這份問卷，我們將不勝感激，這對我們非常重要！
      </p> -->
      <!-- <a
        id="SurveyButton"
        :href="surveyUrl"
        target="_blank"
        class="inline-flex justify-center rounded-lg text-base font-black py-2 mt-3 bg-text-primary w-full"
        >填寫問卷</a
      > -->
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
