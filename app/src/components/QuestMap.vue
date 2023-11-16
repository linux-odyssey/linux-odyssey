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

const chartContainer = ref(null)
let chartInstance = null

use([GraphChart, SVGRenderer, TitleComponent, TooltipComponent])

const data = [
  {
    _id: 'discover',
    title: 'Discover the World!',
    requirements: ['spell'],
  },
  {
    _id: 'read',
    title: 'Read the File',
    requirements: ['spell'],
  },
  {
    _id: 'helloworld',
    title: 'Hello, Linux World!',
    requirements: [],
  },
  {
    _id: 'spell',
    title: 'Learn to spell',
    requirements: ['helloworld'],
  },
  {
    _id: 'move',
    requirements: ['read', 'discover'],
  },
]

const marginX = 100
const marginY = 100

const dag = new DAG(data)
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

const option = {
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
}

const router = useRouter()

function initChart() {
  console.log('initChart', chartContainer.value)
  chartInstance = init(chartContainer.value)
  chartInstance.setOption(option)
  chartInstance.on('click', (params) => {
    console.log('click', params)
    const {
      data: { id },
    } = params

    router.push({ name: 'game', params: { questId: id } })
  })
}

onMounted(() => {
  initChart()
})
</script>
