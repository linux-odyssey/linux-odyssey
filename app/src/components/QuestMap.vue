<template>
  <div class="p-2.5 bg-black w-full h-full flex">
    <div class="text-slate-600 absolute w-full z-0 p-2">
      <h1 class="relative left-1/3">01010111 01100101 01101100 01100011</h1>
      <h1 class="relative left-1/4">
        01101111 01101101 01100101 00100000 01110100 01101111
      </h1>
      <h1 class="relative left-1/4">
        00100000 01001100 01101001 01101110 01110101 01111000 00100000
      </h1>
      <h1 class="relative left-1/4">
        01001111 01100100 01111001 01110011 01110011 01100101 01111001
      </h1>
      <h1 class="relative left-1/4">
        00100001 01010111 01100101 01101100 01100011 01101111 01101101 01100101
      </h1>
      <h1 class="relative left-1/4">
        00100000 01110100 01101111 00100000 01001100 01101001 01101110 01110101
      </h1>
      <h1 class="relative left-1/4">
        01111000 00100000 01001111 01100100 01111001 01110011 01110011 01100101
      </h1>
      <h1 class="relative left-1/4">01111001 00100001</h1>
    </div>
    <h1 class="text-text-primary text-xl absolute left-2 w-full z-1">
      Get through your linux journey!
    </h1>
    <div class="p-2.5 relative w-full h-full z-2">
      <div ref="chartContainer" class="p-2.5 w-full h-full"></div>
    </div>
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
import { NodeImage } from '../img/svg.js'

const marginX = 100
const marginY = 70
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
  render: 'svg',
  tooltip: {},
  animationDurationUpdate: 1500,
  animationEasingUpdate: 'quinticInOut',
  series: [
    {
      type: 'graph',
      layout: 'none',
      symbol: () => {
        return NodeImage
      },
      symbolSize: [200, 100],
      roam: true,
      label: {
        show: true,
        fontSize: 20,
      },
      edgeSymbol: ['circle', 'arrow'],
      edgeSymbolSize: [5, 12],
      edgeLabel: {
        fontSize: 25,
      },
      data: nodes,
      // links: [],
      links: edges,
      lineStyle: {
        opacity: 4,
        width: 3,
        curveness: 0,
      },
      itemStyle: { color: '#454552' },
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
