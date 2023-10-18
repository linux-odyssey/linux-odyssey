<!-- eslint-disable func-names -->
<!-- eslint-disable object-shorthand -->
<script setup>
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts/core'
import { TooltipComponent } from 'echarts/components'
import { TreeChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import config from '../../tailwind.config.js'
import sessionManager from '../utils/session.js'
import {
  folderImage,
  fileImage,
  openFolderImage,
  unknownImage,
} from './images/svg.js'

echarts.use([TooltipComponent, TreeChart, CanvasRenderer])

let pie = null
const { colors } = config.theme.extend
const canvas = ref(null)
const data = sessionManager.graph

const option = {
  tooltip: {
    trigger: 'items',
    triggerOn: 'mousemove',
  },
  series: [
    {
      type: 'tree',
      data: [data],
      top: '20%',
      left: '20%',
      bottom: '20%',
      right: '20%',
      orient: 'LR',
      roam: true,
      symbol: (_value, params) => {
        console.log(_value, params)
        const {
          collapsed,
          data: { type, discovered },
        } = params
        if (!discovered) return unknownImage
        switch (type) {
          case 'folder':
            return collapsed ? folderImage : openFolderImage
          case 'file':
            return fileImage
          default:
            return unknownImage
        }
      },
      symbolSize: 20,
      symbolKeepAspect: true,
      edgeShape: 'polyline',
      edgeForkPosition: '50%',
      initialTreeDepth: 4,
      itemStyle: {
        color: colors.background.primary.DEFAULT,
        borderColor: colors.text.primary.DEFAULT,
      },
      lineStyle: {
        width: 2,
        color: colors.border.DEFAULT.DEFAULT,
      },
      label: {
        color: colors.text.primary.DEFAULT,
        backgroundColor: '',
        position: 'bottom',
        verticalAlign: 'top',
        align: 'center',
      },
      leaves: {
        label: {
          position: 'bottom',
          verticalAlign: 'top',
          align: 'center',
        },
      },
      emphasis: {
        focus: 'none',
      },
      expandAndCollapse: true,
      animationDuration: 550,
      animationDurationUpdate: 750,
    },
  ],
}

onMounted(() => {
  pie = echarts.init(canvas.value)
  pie.setOption(option)
  pie.setOption({
    series: [
      {
        data: [sessionManager.graph.value],
      },
    ],
  })
})

watch(sessionManager.graph, (graph) => {
  console.log('Update graph', graph)
  pie.setOption({
    series: [
      {
        data: [graph],
      },
    ],
  })
})
</script>

<template>
  <div ref="canvas" style="width: 410px; height: 450px"></div>
</template>
