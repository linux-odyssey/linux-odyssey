<template>
  <div>
    <h1 class="text-text-primary text-xl">Quest Map</h1>
    <div ref="chartContainer" style="width: 600px; height: 600px"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { use, init } from 'echarts/core'
import { GraphChart } from 'echarts/charts'
import { SVGRenderer } from 'echarts/renderers'
import { TitleComponent, TooltipComponent } from 'echarts/components'
import { DAG } from '@linux-odyssey/utils'
import api from '../utils/api'

const marginX = 100
const marginY = 100

const chartContainer = ref(null)
let chartInstance = null

use([GraphChart, SVGRenderer, TitleComponent, TooltipComponent])

async function getQuests() {
  try {
    const res = await api.get('/quests')
    return res.data
  } catch (err) {
    console.error(err)
    throw err
  }
}

async function getProgress() {
  try {
    const res = await api.get('/users/me')
    return res.data.progress
  } catch (err) {
    console.error(err)
    throw err
  }
}

const genOption = (nodes, edges) => ({
  rendener: 'svg',
  tooltip: {},
  animationDurationUpdate: 1500,
  animationEasingUpdate: 'quinticInOut',
  series: [
    {
      type: 'graph',
      layout: 'none',
      symbolSize: 50,
      roam: true,
      label: {
        show: true,
      },
      edgeSymbol: ['circle', 'arrow'],
      edgeSymbolSize: [4, 10],
      edgeLabel: {
        fontSize: 20,
      },
      data: nodes,
      // links: [],
      links: edges,
      lineStyle: {
        opacity: 0.9,
        width: 2,
        curveness: 0,
      },
    },
  ],
})

function getOption(quests, progress) {
  const dag = new DAG(quests)
  console.log(progress)

  const nodes = dag.getNodes().map((node) => ({
    id: node._id,
    name: node.title,
    x: marginX * node.index - (marginX * dag.getLayer(node._id)) / 2,
    y: marginY * node.layer,
    completed: progress[node._id]?.completed || false,
    unlocked: node.requirements.every((req) => progress[req]?.completed),
  }))

  console.log(nodes)

  const edges = dag.getEdgesArray().map((edge) => ({
    source: edge[0],
    target: edge[1],
  }))
  return genOption(nodes, edges)
}

const router = useRouter()
const toast = useToast()

function initChart(option) {
  console.log('initChart', chartContainer.value)
  chartInstance = init(chartContainer.value)
  chartInstance.setOption(option)
  chartInstance.on('click', (params) => {
    const {
      data: { id, unlocked },
    } = params

    if (unlocked) {
      router.push({ name: 'game', params: { questId: id } })
    } else {
      toast.warning('You have not completed the previous quest yet!')
    }
  })
}

onMounted(async () => {
  const quests = await getQuests()
  const progress = await getProgress()
  const option = getOption(quests, progress)
  initChart(option)
})
</script>
