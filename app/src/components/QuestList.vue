<!-- eslint-disable no-console -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import api from '../utils/api'
import useUserProfile from '../store/userProfile'

interface Quest {
  _id: string
  requirements: any
  title: string
}

const store = useUserProfile()
const quests = ref<Quest[]>([])
const progressList = ref({})
const questColor = ref({})
// const fullwidth = window.screen.width

async function getQuests() {
  try {
    const res = await api.get('/quests')
    return res.data
  } catch (err) {
    console.error(err)

    throw err
  }
}
function findFirstQuest(inputQuest: any) {
  let firstQuest
  for (let i = 0; i < inputQuest.length; i++) {
    if (inputQuest[i].requirements.length === 0) {
      firstQuest = inputQuest[i]
      break
    }
  }
  return firstQuest
}
function findNextQuest(quest: string, inputQuest: any) {
  const temp = []
  for (let i = 0; i < inputQuest.length; i++) {
    if (inputQuest[i].requirements.includes(quest)) {
      temp.push(inputQuest[i])
    }
  }
  return temp
}
function reorderQuests(inputQuest: any) {
  const orderQuest = []
  const firstQuest = findFirstQuest(inputQuest)
  let current = firstQuest._id
  orderQuest.push(firstQuest)
  for (let i = 0; i < inputQuest.length; i++) {
    const next = findNextQuest(current, inputQuest)
    next.forEach((element) => {
      orderQuest.push(element)
    })
    if (next.length !== 0) {
      current = next[0]._id
    }
  }
  console.log(orderQuest)
  return orderQuest
}
function getOption(questList: any, progress: any) {
  questList.forEach((quest: any) => {
    progressList.value[quest._id] = {
      completed: progress[quest._id]?.completed || false,
      unlocked: quest.requirements.every(
        (req: any) => progress[req]?.completed
      ),
    }
  })
  console.log(progressList.value)
  console.log(questColor.value)
}
function colorizeQuest() {
  Object.keys(progressList.value).forEach((key) => {
    if (progressList.value[key].completed && progressList.value[key].unlocked) {
      questColor.value[key] = '#00ff00'
    } else if (
      !progressList.value[key].completed &&
      progressList.value[key].unlocked
    ) {
      questColor.value[key] = '#ADADB5'
    } else {
      questColor.value[key] = '#505050'
    }
  })
}
const router = useRouter()
const toast = useToast()

onMounted(async () => {
  await store.loadUserProfile()
  const questdata = await getQuests()
  quests.value = reorderQuests(questdata)
  getOption(quests.value, store.progress)
  colorizeQuest()
})
const handleQuests = (id: string) => {
  console.log(id)
  if (progressList.value[id].unlocked) {
    router.push({ name: 'game', params: { questId: id } })
  } else {
    toast.warning('你還沒完成前一個關卡!')
  }
}
</script>
<template>
  <div class="relative bg-black w-full h-full flex place-content-center">
    <div
      class="flex place-content-center w-full bg-catelogbg bg-cover bg-scroll"
    >
      <div class="w-4/5 grid justify-items-center">
        <button
          class="w-full flex h-4/5 place-content-left rounded-md"
          :style="{ backgroundColor: questColor[item._id] }"
          v-for="item in quests"
          :key="item._id"
          @click="handleQuests(item._id)"
        >
          <div class="text-text m-5">
            {{ item.title }}
          </div>
          <div></div>
        </button>
      </div>
    </div>
  </div>
</template>
