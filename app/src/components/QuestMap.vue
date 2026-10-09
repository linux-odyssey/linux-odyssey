<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, watch, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { DAG } from '../../../packages/utils'
import { trpc } from '../utils/trpc'
import useUserProfile from '../store/userProfile'
import QuestIntro from './QuestIntro.vue'

const { t, locale } = useI18n()
const store = useUserProfile()
const toast = useToast()

const marginX = 120
const marginY = 120

const nodeWidth = 160
const nodeHeight = 50

const opened = ref<Node | null>(null)
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

function startDrag(event: PointerEvent) {
  isDragging.value = true
  dragStartX.value = event.clientX - offsetX.value
  dragStartY.value = event.clientY - offsetY.value
}

function drag(event: PointerEvent) {
  if (!isDragging.value) return
  // Capture only once dragging starts so plain clicks still reach the node buttons
  const el = event.currentTarget as HTMLElement
  if (!el.hasPointerCapture(event.pointerId))
    el.setPointerCapture(event.pointerId)
  offsetX.value = event.clientX - dragStartX.value
  offsetY.value = event.clientY - dragStartY.value
}

function endDrag() {
  isDragging.value = false
}

async function computeGraphData() {
  if (!store.progress) return

  try {
    const quests = await trpc.quests.getQuests.query({ locale: locale.value })

    const dag = new DAG(quests)
    const nodesValues = dag.getNodes()

    const nodes = nodesValues.map((node) => ({
      id: node.id,
      title: node.title,
      x: marginX * node.layer * 2,
      // Centered on 0; the world container is anchored at the viewport's vertical center
      y: (node.index - (dag.getLayer(node.id) + 1) / 2) * marginY,
      completed: store.progress[node.id]?.completed || false,
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
    console.error(t('quest_map.compute_graph_failed'), error)
    toast.error(t('quest_map.load_quest_data_failed'))
  }
}
function handleNodeClick(node: Node) {
  opened.value = node
}
function closeIntro(close: boolean) {
  if (close) {
    opened.value = null
  }
}

onMounted(async () => {
  await store.loadUserProfile()
  await computeGraphData()
})

watch(() => store.progress, computeGraphData, { deep: true })
watch(locale, () => {
  opened.value = null
  computeGraphData()
})

const edgePath = computed(() => {
  return (source: Node, target: Node) => {
    const mx = (source.x + target.x) / 2
    return `M${source.x},${source.y}C${mx},${source.y} ${mx},${target.y} ${target.x},${target.y}`
  }
})

const nodeStyle = computed(() => {
  return (node: Node) => {
    if (node.completed) return 'completed'
    if (node.unlocked) return 'unlocked'
    return 'locked'
  }
})

const edgeStyle = computed(() => {
  return (edge: Edge) => {
    return edge.target.unlocked ? 'unlocked' : 'locked'
  }
})
</script>

<template>
  <div class="relative bg-black w-full h-full flex">
    <div
      class="flex place-content-center w-full bg-catelogbg bg-cover bg-scroll"
    >
      <h1
        class="p-10 absolute w-fit z-2 font-mono flex flax-wrap text-xl"
        style="width: 30%; height: 6%; font-size: 3vh; color: #00ff00"
      >
        {{ t('quest_map.intro') }}
      </h1>
      <div
        class="absolute inset-0 overflow-hidden select-none"
        :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'"
        style="touch-action: none"
        @pointerdown="startDrag"
        @pointermove="drag"
        @pointerup="endDrag"
        @pointercancel="endDrag"
      >
        <div
          class="absolute top-1/2 left-0"
          :style="{ transform: `translate(${offsetX}px, ${offsetY}px)` }"
        >
          <svg class="absolute overflow-visible pointer-events-none">
            <path
              v-for="edge in graphData.edges"
              :key="`${edge.source.id}-${edge.target.id}`"
              :d="edgePath(edge.source, edge.target)"
              :class="['edge', edgeStyle(edge)]"
            />
          </svg>
          <button
            v-for="node in graphData.nodes"
            :key="node.id"
            type="button"
            :class="['node', nodeStyle(node)]"
            :style="{
              left: `${node.x - nodeWidth / 2}px`,
              top: `${node.y - nodeHeight / 2}px`,
              width: `${nodeWidth}px`,
              height: `${nodeHeight}px`,
            }"
            @click="handleNodeClick(node)"
          >
            <span class="line-clamp-2">{{ node.title }}</span>
          </button>
        </div>
      </div>
      <QuestIntro
        :questTitle="opened.title"
        :questId="opened.id"
        :questUnlocked="opened.unlocked"
        v-if="opened"
        @close-intro="closeIntro"
      />
    </div>
  </div>
</template>

<style scoped>
.node {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.5rem;
  text-align: center;
  border-radius: 10px;
  cursor: pointer;
  transition:
    filter 0.15s,
    box-shadow 0.15s;
}
.node:hover {
  filter: brightness(1.15);
}
.node:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px #00ff00;
}
.node.completed {
  background-color: #6cf76c;
  color: #1d1d1d;
}
.node.unlocked {
  background-color: #8c8c92;
  color: #ffffff;
}
.node.locked {
  background-color: #505050;
  color: #a0a0a0;
}

.edge {
  stroke-width: 3;
  fill: none;
}
.edge.unlocked {
  stroke: #adadb5;
  stroke-dasharray: none;
}
.edge.locked {
  stroke: #454552;
  stroke-dasharray: 5, 5;
}
</style>
