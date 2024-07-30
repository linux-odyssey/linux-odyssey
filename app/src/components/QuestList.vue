<!-- eslint-disable no-console -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../utils/api'
import useUserProfile from '../store/userProfile'
import QuestIntro from './QuestIntro.vue'

interface Quest {
  _id: string
  requirements: any
  title: string
}
interface Progress {
  [key: string]: {
    completed: boolean
    unlocked: boolean
  }
}
interface color {
  [key: string]: string
}
const store = useUserProfile()
const quests = ref<Quest[]>([])
const progressList = ref<Progress>({})
const questColor = ref<color>({})
const questTextColor = ref<color>({})
const openedQuest = ref<string | null>(null)
const router = useRouter()
const route = useRoute()
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
}
function colorizeQuest() {
  Object.keys(progressList.value).forEach((key: any) => {
    if (progressList.value[key].completed && progressList.value[key].unlocked) {
      questColor.value[key] = '#00ff00'
      questTextColor.value[key] = '#000000'
    } else if (
      !progressList.value[key].completed &&
      progressList.value[key].unlocked
    ) {
      questColor.value[key] = '#ADADB5'
      questTextColor.value[key] = '#000000'
    } else {
      questColor.value[key] = '#505050'
      questTextColor.value[key] = '#ffffff'
    }
  })
}

onMounted(async () => {
  await store.loadUserProfile()
  const questdata = await getQuests()
  quests.value = reorderQuests(questdata)
  getOption(quests.value, store.progress)
  colorizeQuest()
  if (route.params.questId) {
    openedQuest.value = route.params.questId as string
  }
})
const handleIntro = (id: string) => {
  openedQuest.value = id
  router.push({ name: 'map', params: { questId: id } })
}
</script>
<template>
  <div class="relative bg-black w-full h-full flex place-content-center">
    <div
      class="flex place-content-center w-full bg-catelogbg bg-cover bg-scroll"
    >
      <div class="w-3/5 h-full pt-5 grid grid-cols-1 overflow-y-auto">
        <button
          class="w-full h-4/5 rounded-md flex items-center justify-between"
          :style="{ backgroundColor: questColor[item._id] }"
          v-for="item in quests"
          :key="item._id"
          @click="handleIntro(item._id)"
        >
          <div
            class="m-4 justify-self-start w-fit"
            :style="{ color: questTextColor[item._id] }"
          >
            {{ item.title }}
          </div>
          <div
            class="m-3 w-fit h-fit"
            :style="{ color: questTextColor[item._id] }"
          >
            <font-awesome-icon
              :icon="['fas', 'chevron-down']"
              v-if="openedQuest !== item._id"
            />
            <font-awesome-icon
              :icon="['fas', 'chevron-down']"
              flip="vertical"
              v-if="openedQuest === item._id"
            />
          </div>
          <QuestIntro
            :questTitle="item.title"
            :questId="item._id"
            :progress="progressList[item._id]"
            :questColor="questColor[item._id]"
            :questTextColor="questTextColor[item._id]"
            v-if="openedQuest === item._id"
          />
        </button>
      </div>
    </div>
  </div>
</template>
