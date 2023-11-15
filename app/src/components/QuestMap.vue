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
import { use, init } from 'echarts/core'
import { GraphChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { TitleComponent, TooltipComponent } from 'echarts/components'

const chartContainer = ref(null)
let chartInstance = null
const layers = [
  [
    {
      name: 'helloworld',
    },
  ],
  [
    {
      name: 'spell',
    },
  ],
  [
    {
      name: 'read',
    },
    {
      name: 'discover',
    },
  ],
  [
    {
      name: 'remove',
    },
  ],
]

const edges = [
  {
    source: 'helloworld',
    target: 'spell',
  },
  {
    source: 'spell',
    target: 'read',
  },
  {
    source: 'spell',
    target: 'discover',
  },
  {
    source: 'read',
    target: 'remove',
  },
  {
    source: 'discover',
    target: 'remove',
  },
]

function toNodes(layers) {
  return [
    {
      name: 'helloworld',
      x: 100,
      y: 100,
    },
  ]
}

use([GraphChart, CanvasRenderer, TitleComponent, TooltipComponent])

const option = {
  title: {
    text: 'Quest Map',
  },
  rendener: 'canvas',
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
      data: [
        {
          name: 'Node 1',
          x: 300,
          y: 300,
        },
        {
          name: 'Node 2',
          x: 800,
          y: 300,
        },
        {
          name: 'Node 3',
          x: 550,
          y: 100,
        },
        {
          name: 'Node 4',
          x: 550,
          y: 500,
        },
      ],
      // links: [],
      links: [
        {
          source: 0,
          target: 1,
          symbolSize: [5, 20],
          label: {
            show: true,
          },
          lineStyle: {
            width: 5,
            curveness: 0.2,
          },
        },
        {
          source: 'Node 2',
          target: 'Node 1',
          label: {
            show: true,
          },
          lineStyle: {
            curveness: 0.2,
          },
        },
        {
          source: 'Node 1',
          target: 'Node 3',
        },
        {
          source: 'Node 2',
          target: 'Node 3',
        },
        {
          source: 'Node 2',
          target: 'Node 4',
        },
        {
          source: 'Node 1',
          target: 'Node 4',
        },
      ],
      lineStyle: {
        opacity: 0.9,
        width: 2,
        curveness: 0,
      },
    },
  ],
}

function initChart() {
  console.log('initChart', chartContainer.value)
  chartInstance = init(chartContainer.value)
  chartInstance.setOption(option)
}

onMounted(() => {
  initChart()
})
</script>
