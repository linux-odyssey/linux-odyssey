<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { DAG } from '@linux-odyssey/utils'
import { getQuests } from '../utils/api'
import useUserProfile from '../store/userProfile'

const store = useUserProfile()
const router = useRouter()
const toast = useToast()

const svgWidth = ref(window.innerWidth)
const svgHeight = ref(window.innerHeight)

const marginX = 100
const marginY = 100

const nodeWidth = 150
const nodeHeight = 50

type Node = {
  id: string
  title: string
  x: number
  y: number
  index: number
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

const isDragging = ref(false)
const dragStartX = ref(0)
const dragStartY = ref(0)
const offsetX = ref(0)
const offsetY = ref(0)

function startDrag(event: MouseEvent) {
  isDragging.value = true
  dragStartX.value = event.clientX - offsetX.value
  dragStartY.value = event.clientY - offsetY.value
}

function drag(event: MouseEvent) {
  if (!isDragging.value) return
  offsetX.value = event.clientX - dragStartX.value
  offsetY.value = event.clientY - dragStartY.value
}

function endDrag() {
  isDragging.value = false
}

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
      index: node.index,
    }))

    const edges = dag
      .getEdgesArray()
      .map((edge) => ({
        source: nodes.find((n) => n.id === edge[0]),
        target: nodes.find((n) => n.id === edge[1]),
      }))
      .filter(
        (edge): edge is Edge =>
          edge.source !== undefined && edge.target !== undefined
      )

    graphData.value = { nodes, edges }
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

const curvedPath = computed(() => {
  return (source: Node, target: Node) => {
    // const dx = target.x - source.x
    // const dy = target.y - source.y
    // const dr = Math.sqrt(dx * dx + dy * dy)
    const dr = 0
    const sweep = target.index > source.index ? 0 : 1 // Determines if the arc should curve up or down based on node index
    return `M${source.x},${source.y}A${dr},${dr} 0 0,${sweep} ${target.x},${target.y}`
  }
})
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
    <svg
      :width="svgWidth"
      :height="svgHeight"
      class="absolute"
      @mousedown="startDrag"
      @mousemove="drag"
      @mouseup="endDrag"
      @mouseleave="endDrag"
    >
      <g :transform="`translate(${offsetX}, ${offsetY})`">
        <g
          v-for="edge in graphData.edges"
          :key="`${edge.source.id}-${edge.target.id}`"
        >
          <path
            :d="curvedPath(edge.source, edge.target)"
            :stroke="edge.target.unlocked ? '#ADADB5' : '#454552'"
            :stroke-dasharray="edge.target.unlocked ? 'none' : '5,5'"
            stroke-width="3"
            fill="none"
          />
        </g>
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
      </g>
    </svg>
  </div>
</template>

<style scoped>
svg {
  overflow: visible;
}
</style>
