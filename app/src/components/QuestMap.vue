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

const svgWidth = ref(window.innerWidth)
const svgHeight = ref(window.innerHeight)

const marginX = 120
const marginY = 120

const nodeWidth = 160
const nodeHeight = 50
const maxTextWidth = nodeWidth - 20
const fontSize = 16
const maxLines = 2

// Approximate glyph width: wide (CJK etc.) chars take a full em, others about half
function charWidth(ch: string) {
  return ch.charCodeAt(0) > 0x2e80 ? fontSize : fontSize * 0.55
}

function textWidth(s: string) {
  return [...s].reduce((w, ch) => w + charWidth(ch), 0)
}

// SVG text does not wrap, so split the title into lines that fit the node
function wrapTitle(title: string): string[] {
  const lines: string[] = []
  let current = ''
  // Keep whole words together for spaced languages; CJK splits per character
  const tokens = title.match(/[⺀-￿]|\S+\s*/g) ?? []
  for (const token of tokens) {
    if (current && textWidth((current + token).trimEnd()) > maxTextWidth) {
      lines.push(current.trimEnd())
      current = ''
    }
    current += token
  }
  if (current) lines.push(current.trimEnd())

  if (lines.length <= maxLines) return lines
  const kept = lines.slice(0, maxLines)
  let last = kept[maxLines - 1]
  while (last && textWidth(last + '…') > maxTextWidth) last = last.slice(0, -1)
  kept[maxLines - 1] = last + '…'
  return kept
}

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
    const quests = await trpc.quests.getQuests.query({ locale: locale.value })

    const dag = new DAG(quests)
    const nodesValues = dag.getNodes()

    const nodes = nodesValues.map((node) => ({
      id: node.id,
      title: node.title,
      x: marginX * node.layer * 2,
      y:
        marginY * node.index -
        (marginX * dag.getLayer(node.id)) / 2 +
        svgHeight.value / 2,
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
    console.error('Error computing graph data:', error)
    toast.error('Failed to load quest data')
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
              :class="['edge', edgeStyle(edge)]"
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
              :class="['node', nodeStyle(node)]"
            />
            <text
              :x="node.x"
              :y="node.y"
              text-anchor="middle"
              dominant-baseline="central"
              :class="['node-text', nodeStyle(node)]"
            >
              <tspan
                v-for="(line, i) in wrapTitle(node.title)"
                :key="i"
                :x="node.x"
                :dy="i === 0 ? `${-(wrapTitle(node.title).length - 1) * 0.6}em` : '1.2em'"
              >
                {{ line }}
              </tspan>
            </text>
          </g>
        </g>
      </svg>
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
svg {
  overflow: visible;
}

.node {
  &.completed {
    fill: #6cf76c;
  }
  &.unlocked {
    fill: #8c8c92;
  }
  &.locked {
    fill: #505050;
  }
}

.node-text {
  cursor: pointer;
  &.completed {
    fill: #1d1d1d;
  }
  &.unlocked {
    fill: #ffffff;
  }
  &.locked {
    fill: #a0a0a0;
  }
}

.edge {
  stroke-width: 3;
  fill: none;
  &.unlocked {
    stroke: #adadb5;
    stroke-dasharray: none;
  }
  &.locked {
    stroke: #454552;
    stroke-dasharray: 5, 5;
  }
}
</style>
