<template>
  <div class="relative bg-black w-full h-full flex">
    <img
      src="../img/catelogbg.svg"
      alt="bg"
      class="p-2 stroke-2 scale-120 justify-center items-center"
    />
    <h1
      class="text-text-primary text-xl p-2.5 absolute w-fit z-2 font-mono font-bold flex flax-wrap"
    >
      Get through your linux journey!
    </h1>
    <div class="flex flex-wrap absolute w-full h-full z-1">
      <div ref="chartContainer" class="w-full h-full flex flex-wrap"></div>
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
const marginY = 65
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
    console.log(res.data.progress)
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
        fontSize: 22,
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
        // type: 'dashed',
        type: (params) => {
          const {
            data: { unlocked },
          } = params
          console.log(unlocked)
          switch (unlocked) {
            case true:
              return 'line'
            default:
              return 'dashed'
          }
        },
      },
      itemStyle: {
        color: (params) => {
          const {
            data: { completed },
          } = params
          switch (completed) {
            case true:
              return '#ADADB5'
            default:
              return '#454552'
          }
        },
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
