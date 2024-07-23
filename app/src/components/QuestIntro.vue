<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { ref, defineProps } from 'vue'
// import { surveyUrl } from '../config'

const props = defineProps({
  questTitle: {
    type: String,
    required: true,
  },
  questId: {
    type: String,
    required: true,
  },
  progress: {
    type: Object,
    required: true,
  },
  questColor: {
    type: String,
    required: true,
  },
  questTextColor: {
    type: String,
    required: true,
  },
})

const showIntro = ref(true) // Controls whether the modal is visible or not
const router = useRouter()
const toast = useToast()
const { questTitle, questId, progress, questColor, questTextColor } = props
const closeModal = () => {
  showIntro.value = false
}

// const backtoMap = async () => {
//   try {
//     router.push({ name: 'map' })
//   } catch (err) {
//     toast.error('無法讀取地圖')
//     console.error(err)
//   }
// }
const handleQuests = (id: string) => {
  console.log(id)
  console.log(progress)
  if (progress.unlocked) {
    router.push({ name: 'game', params: { questId: id } })
  } else {
    toast.warning('你還沒完成前一個關卡!')
  }
}
// Simulate completing a quest to show the modal
setTimeout(() => {
  showIntro.value = true
}, 5000) // Show modal after 5 seconds
</script>

<template>
  <div v-if="showIntro" class="modal">
    <div class="modal-content bg-bg-secondary rounded-lg">
      <span class="close text-text content-between" @click="closeModal"
        >&times;</span
      >

      <h2
        id="QuestTitle"
        class="text-2xl text-text mb-5 w-full inline-flex justify-center"
      >
        {{ questTitle }}
      </h2>
      <a
        id="StartAdventure"
        target="_blank"
        @click="handleQuests(questId)"
        :style="{ backgroundColor: questColor, color: questTextColor }"
        class="inline-flex justify-center rounded-lg text-base font-black py-2 mt-3 w-full"
        >開始冒險</a
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
  width: 70%;
  height: 70%;
}

.close {
  position: absolute;
  top: 0;
  right: 10px;
  font-size: 30px;
  cursor: pointer;
}
</style>
