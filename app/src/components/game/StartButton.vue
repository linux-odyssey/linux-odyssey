<script setup lang="ts">
import { useToast } from 'vue-toastification'
import { onMounted, ref } from 'vue'
import useSession from '../../store/session'

const props = defineProps({
  questId: {
    type: String,
    required: true,
  },
})

const toast = useToast()
const showCover = ref(true)
const sessionStore = useSession()

onMounted(async () => {
  sessionStore.setQuest(props.questId)
  if (await sessionStore.getActiveSession()) {
    showCover.value = false
  }
  sessionStore.setup()
})

const startSession = async () => {
  try {
    await sessionStore.createSession()
    showCover.value = false
  } catch (err: any) {
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
