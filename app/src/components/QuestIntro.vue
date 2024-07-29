<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { ref, defineProps, onMounted } from 'vue'
import { getQuest } from '../utils/api'
import MarkdownText from './MarkdownText.vue'

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
  router.push({ name: 'map' })
}
const questInstruction = ref('')
const handleQuests = (id: string) => {
  console.log(id)
  console.log(progress)
  if (progress.unlocked) {
    router.push({ name: 'game', params: { questId: id } })
  } else {
    toast.warning('你還沒完成前一個關卡!')
  }
}

onMounted(async () => {
  const quest = await getQuest(questId)
  questInstruction.value = quest.instruction
})
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
      <div class="w-full h-3/5 p-8">
        <div class="px-5 whitespace-pre-wrap">
          <MarkdownText
            class="text-text markdown-content"
            :content="questInstruction"
          />
        </div>
      </div>
      <a
        id="StartAdventure"
        target="_blank"
        @click="handleQuests(questId)"
        :style="{ backgroundColor: questColor, color: questTextColor }"
        class="inline-flex justify-center rounded-lg text-base font-black py-3 mt-5 w-full text-lg"
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
  margin: 10% auto;
  padding: 20px;
  width: 60%;
  height: 50%;
}

.close {
  position: absolute;
  top: 0;
  right: 10px;
  font-size: 30px;
  cursor: pointer;
}
.markdown-content {
  text-align: left;
}
</style>
