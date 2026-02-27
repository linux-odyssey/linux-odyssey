<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useSession } from '../store/session'
import useUserProfile from '../store/userProfile'
import HeaderPart from '../components/header/HeaderPart.vue'
import GameHeaderComponents from '../components/header/GameHeaderComponents.vue'
import DescriptionPart from '../components/game/DescriptionPart.vue'
import QuestPart from '../components/game/QuestPart.vue'
import TerminalPart from '../components/game/TerminalPart.vue'
import VisualizationPart from '../components/game/VisualizationPart.vue'
import ControlPalette from '../components/game/ControlPalette.vue'
import CompleteModal from '../components/game/CompleteModal.vue'
import StartButton from '../components/game/StartButton.vue'
import { openQuestSurvey } from '../utils/formbricks'

const sessionStore = useSession()
const userStore = useUserProfile()

const completed = computed(() => {
  return sessionStore.session?.status === 'finished'
})

watch(completed, (newValue, oldValue) => {
  if (newValue && !oldValue) {
    console.log('finish', userStore)
    openQuestSurvey()
  }
})

const props = defineProps({
  questId: {
    type: String,
    required: true,
  },
})

onMounted(async () => {
  sessionStore.reset()
  sessionStore.setup()
  await sessionStore.setQuest(props.questId)
  await sessionStore.getActiveSession()
})
</script>

<template>
  <!-- game header -->
  <div class="w-full">
    <HeaderPart
      :title="sessionStore.quest?.title"
      :headerComponent="GameHeaderComponents"
    />
  </div>
  <!-- current status indicator -->
  <input
    type="hidden"
    id="currentStatus"
    :value="sessionStore.session?.status"
  />
  <!-- main -->
  <div id="main" class="h-full pt-10 w-full flex p-3 space-x-3">
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
    <div class="bg-bg h-full rounded-lg w-1/2">
      <StartButton :questId="$props.questId" />
      <section id="hint" class="h-3/5">
        <DescriptionPart />
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
