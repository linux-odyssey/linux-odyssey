<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import sessionStore, { init } from '../store/session'
import GameHeaderPart from '../components/GameHeaderPart.vue'
// import CommandlistPart from '../components/CommandlistPart.vue'
import HintPart from '../components/HintPart.vue'
import QuestPart from '../components/QuestPart.vue'
import TerminalPart from '../components/TerminalPart.vue'
import VisualizationPart from '../components/VisualizationPart.vue'
import ControlPalette from '../components/ControlPalette.vue'
import CompleteModal from '../components/CompleteModal.vue'
import { LoadQuestError, LoadSessionError } from '../utils/errors'

const completed = computed(() => {
  return sessionStore.session.status === 'finished'
})

const props = defineProps({
  questId: {
    type: String,
    required: true,
  },
})

const toast = useToast()

onMounted(async () => {
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
})
</script>

<template>
  <!-- game header -->
  <div class="h-[6vh] w-full">
    <GameHeaderPart :title="sessionStore.quest?.title" />
  </div>
  <!-- current status indicator -->
  <input
    type="hidden"
    id="currentStatus"
    :value="sessionStore.session.status"
  />
  <!-- main -->
  <div id="main" class="h-[94vh] w-full flex p-3 space-x-3">
    <!-- Topic and Command List -->
    <div class="bg-bg-secondary h-full w-1/4 rounded-lg">
      <section id="quest" class="h-full p-3 overflow-auto">
        <QuestPart />
      </section>
      <!-- <hr class="border-border border" />
      <section id="cmdlist" class="h-1/3">
        <CommandlistPart />
      </section> -->
    </div>
    <!-- Terminal and Hint -->
    <div class="bg-bg h-full w-1/2 rounded-lg">
      <section id="hint" class="h-3/5">
        <HintPart />
      </section>
      <hr class="border-border border" />
      <section id="terminal" class="h-2/5 overflow-hidden">
        <TerminalPart />
      </section>
    </div>
    <!-- Visualization -->
    <div class="h-full w-1/4">
      <div class="bg-border rounded-xl h-[90%] p-2">
        <div class="bg-bg rounded-lg h-full p-2">
          <section id="visualization" class="bg-bg-primary h-full rounded-md">
            <VisualizationPart />
          </section>
        </div>
      </div>
      <ControlPalette />
    </div>
    <CompleteModal v-if="completed" />
  </div>
</template>
