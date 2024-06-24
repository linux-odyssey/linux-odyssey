<script setup lang="ts">
import { useToast } from 'vue-toastification'
import { ref } from 'vue'
import { init, setQuest } from '../../store/session'
import { LoadQuestError, LoadSessionError } from '../../utils/errors'

const props = defineProps({
  questId: {
    type: String,
    required: true,
  },
})

const toast = useToast()
const showCover = ref(true)
setQuest(props.questId)
const startSession = async () => {
  showCover.value = false
  try {
    await init(props.questId)
  } catch (err: any) {
    if (err instanceof LoadQuestError) {
      toast.error(`無法讀取關卡: ${err.questId}，請確認網頁連結。`)
      return
    }
    if (err instanceof LoadSessionError) {
      toast.error(`無法建立工作階段: ${err.questId}，請重新登入再試一次。`)
      return
    }
    console.error(err)
    toast.error(err.message)
  }
}
</script>
<template>
  <div
    v-if="showCover"
    class="bg-bg-secondary h-full w-1/2 fixed bg-opacity-50 flex justify-center items-center"
  >
    <button
      id="start"
      class="bg-bg-secondary rounded-lg p-3"
      @click="startSession"
    >
      <font-awesome-icon
        :icon="['fas', 'play']"
        class="text-text-primary h-full px-3"
      />
      <p class="text-text-primary inline ml-1 md:flex">開始</p>
    </button>
  </div>
</template>
