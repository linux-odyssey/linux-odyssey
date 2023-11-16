<template>
  <div>
    <h1 class="text-text-primary text-xl">Quest Map</h1>
    <!-- <div class="flex flex-col items-center">
      <div v-for="layer in layers" :key="layer" class="flex flex-row">
        <div v-for="node in layer" :key="node.name">
          <div class="text-text m-5">{{ node.name }}</div>
        </div>
      </div>
    </div> -->
    <div ref="chartContainer" style="width: 410px; height: 450px"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
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

const genOption = (nodes, edges) => ({
  title: {
    text: 'Quest Map',
  },
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

function getOption(quests) {
  const dag = new DAG(quests)

  const nodes = dag.getNodes().map((node) => ({
    id: node._id,
    name: node.title,
    x: marginX * node.index - (marginX * dag.getLayer(node._id)) / 2,
    y: marginY * node.layer,
  }))

  const edges = dag.getEdgesArray().map((edge) => ({
    source: edge[0],
    target: edge[1],
  }))
  return genOption(nodes, edges)
}

const router = useRouter()

function initChart(option) {
  console.log('initChart', chartContainer.value)
  chartInstance = init(chartContainer.value)
  chartInstance.setOption(option)
  chartInstance.on('click', (params) => {
    const {
      data: { id },
    } = params

    router.push({ name: 'game', params: { questId: id } })
  })
}

onMounted(async () => {
  const quests = await getQuests()
  const option = getOption(quests)
  initChart(option)
})
</script>
