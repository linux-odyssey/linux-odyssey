<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { IQuest } from '@linux-odyssey/models'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { DAG } from '@linux-odyssey/utils'
import api from '../utils/api'
import useUserProfile from '../store/userProfile'

const store = useUserProfile()
const router = useRouter()
const toast = useToast()

const svgWidth = ref(window.innerWidth)
const svgHeight = ref(window.innerHeight)

const marginX = 80
const marginY = 80

const nodeWidth = 150
const nodeHeight = 50

async function getQuests() {
  try {
    const res = await api.get<IQuest[]>('/quests')
    return res.data
  } catch (err) {
    console.error(err)
    throw err
  }
}

type Node = {
  id: string
  title: string
  x: number
  y: number
  completed: boolean
  unlocked: boolean
}

type Edge = {
  source: Node
  target: Node
}

const graphData = ref<{ nodes: Node[]; edges: Edge[] }>({
  nodes: [],
  edges: [],
})

async function computeGraphData() {
  if (!store.progress) return

  try {
    const quests = await getQuests()
    const dag = new DAG(quests)
    const nodesValues = dag.getNodes()

    const nodes = nodesValues.map((node) => ({
      id: node._id,
      title: node.title,
      x: marginX * node.layer * 2,
      y:
        marginY * node.index -
        (marginX * dag.getLayer(node._id)) / 2 +
        svgHeight.value / 2,
      completed: store.progress[node._id]?.completed || false,
      unlocked: node.requirements.every(
        (req: string) => store.progress[req]?.completed
      ),
    }))

    // const edges = dag.getEdgesArray().map((edge) => ({
    //   source: nodes.find((n) => n.id === edge[0]),
    //   target: nodes.find((n) => n.id === edge[1]),
    // }))

    graphData.value = { nodes, edges: [] }
  } catch (error) {
    console.error('Error computing graph data:', error)
    toast.error('Failed to load quest data')
  }
}

function handleNodeClick(node: { id: string; unlocked: boolean }) {
  if (node.unlocked) {
    router.push({ name: 'game', params: { questId: node.id } })
  } else {
    toast.warning('你還沒完成前一個關卡!')
  }
}

onMounted(async () => {
  await store.loadUserProfile()
  await computeGraphData()
})

watch(() => store.progress, computeGraphData, { deep: true })
</script>

<template>
  <div class="relative bg-black w-full h-full flex">
    <img
      src="../img/catelogbg.svg"
      alt="bg"
      class="p-2 stroke-2 scale-y-120 justify-center items-center"
    />
    <h1
      class="p-10 absolute w-fit z-2 font-mono flex flax-wrap text-xl"
      style="width: 30%; height: 6%; font-size: 3vh; color: #00ff00"
    >
      踏上你的Linux冒險之旅吧！
    </h1>
    <svg :width="svgWidth" :height="svgHeight" class="absolute">
      <!-- <g
        v-for="edge in graphData.edges"
        :key="`${edge.source.id}-${edge.target.id}`"
      >
        <line
          :x1="edge.source.x"
          :y1="edge.source.y"
          :x2="edge.target.x"
          :y2="edge.target.y"
          :stroke="edge.target.unlocked ? '#ADADB5' : '#454552'"
          :stroke-dasharray="edge.target.unlocked ? 'none' : '5,5'"
          stroke-width="3"
        />
      </g> -->
      <g
        v-for="node in graphData.nodes"
        :key="node.id"
        @click="handleNodeClick(node)"
      >
        <rect
          :x="node.x - nodeWidth / 2"
          :y="node.y - nodeHeight / 2"
          :width="nodeWidth"
          :height="nodeHeight"
          rx="10"
          ry="10"
          :fill="
            node.completed ? '#00bb00' : node.unlocked ? '#ADADB5' : '#505050'
          "
        />
        <text
          :x="node.x"
          :y="node.y"
          text-anchor="middle"
          alignment-baseline="middle"
          fill="white"
          font-size="16"
        >
          {{ node.title }}
        </text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
svg {
  overflow: visible;
}
</style>
