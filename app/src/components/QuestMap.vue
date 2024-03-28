<!-- eslint-disable no-console -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { use, init } from 'echarts/core'
import { GraphChart } from 'echarts/charts'
import { SVGRenderer } from 'echarts/renderers'
import {
  TitleComponent,
  TooltipComponent,
  DataZoomComponent,
} from 'echarts/components'
import { DAG } from '@linux-odyssey/utils'
import api from '../utils/api'
import { NodeImage } from '../img/svg.js'

const marginX = 500
const marginY = 300
const chartContainer = ref(null)
let chartInstance = null
const fullwidth = window.screen.width

use([
  GraphChart,
  SVGRenderer,
  TitleComponent,
  TooltipComponent,
  DataZoomComponent,
])

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

const genOption = (nodes: any, edges: any) => ({
  renderer: 'svg',
  tooltip: {},
  animationDurationUpdate: 1500,
  animationEasingUpdate: 'quinticInOut',
  // dataZoom: [
  //   {
  //     type: 'slider', // This type means "slider data zoom" which provides a slider bar for zooming
  //     orient: 'vertical', // This makes the data zoom component vertical
  //     start: 0, // The starting percentage of the window out of the data extent
  //     end: 100, // The ending percentage of the window out of the data extent
  //     show: true,
  //   },
  // ],
  series: [
    {
      type: 'graph',
      layout: 'none',
      symbol: () => {
        return NodeImage
      },
      symbolSize: [fullwidth / 13, fullwidth / 30],
      roam: 'move',
      zoom: 1.5,
      center: ['120%', '30%'],
      label: {
        show: true,
        fontSize: fullwidth / 90,
      },
      edgeSymbol: ['pin', 'arrow'],
      edgeSymbolSize: [2, 15],
      edgeLabel: {
        fontSize: 25,
      },
      data: nodes,
      // links: [],
      links: edges,
      lineStyle: {
        width: 3,
        color: 'gray',
        opacity: 4,
        curveness: 0.08,
      },
      itemStyle: {
        color: (params: any) => {
          const {
            data: { completed, unlocked },
          } = params
          if (completed) {
            return '#00ff00'
          }
          if (unlocked) {
            return '#ADADB5'
          }
          return '#505050'
        },
      },
    },
  ],
})

function getOption(quests: any, progress: any) {
  const dag = new DAG(quests)

  const nodes = dag.getNodes().map((node) => ({
    id: node._id,
    name: node.title,
    y: marginX * node.index - (marginX * dag.getLayer(node._id)) / 2,
    x: marginY * node.layer * 2,
    completed: progress[node._id]?.completed || false,
    unlocked: node.requirements.every((req: any) => progress[req]?.completed),
  }))
  const lineAppearence = (node: any) => {
    try {
      const { unlocked } = node
      return {
        type: unlocked ? 'line' : 'dashed',
        color: unlocked ? '#ADADB5' : '#454552',
      }
    } catch (err) {
      console.error(err)
      throw err
    }
  }
  const edges = dag.getEdgesArray().map((edge: any) => ({
    source: edge[0],
    target: edge[1],
    lineStyle: lineAppearence(nodes.find((node) => node.id === edge[1])),
  }))
  return genOption(nodes, edges)
}

const router = useRouter()
const toast = useToast()

function initChart(option: any) {
  chartInstance = init(chartContainer.value)
  chartInstance.setOption(option)
  chartInstance.on('click', (params: any) => {
    const {
      data: { id, unlocked },
    } = params

    if (unlocked) {
      router.push({ name: 'game', params: { questId: id } })
    } else {
      toast.warning('你還沒完成前一個關卡!')
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

<template>
  <div class="relative bg-black w-full h-full flex">
    <img
      src="../img/catelogbg.svg"
      alt="bg"
      class="p-2 stroke-2 scale-y-120 justify-center items-center"
    />
    <h1
      class="p-4 absolute w-fit z-2 font-mono flex flax-wrap text-xl"
      style="width: 30%; height: 6%; font-size: 3vh; color: #00ff00"
    >
      踏上你的Linux冒險之旅吧！
    </h1>
    <div class="flex flex-wrap absolute w-full h-full z-1">
      <div ref="chartContainer" class="w-full h-full flex flex-wrap"></div>
    </div>
  </div>
</template>
