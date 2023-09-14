<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts/core'
import { TooltipComponent } from 'echarts/components'
import { TreeChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import sessionManager from '../utils/session.js'

import treedata from './treedata.js'
import folderImage from './images/folder.svg'
import fileImage from './images/file.svg'

console.log(folderImage)

echarts.use([TooltipComponent, TreeChart, CanvasRenderer])

const canvas = ref(null)

// const data = seesionManager.graph.value
const data = treedata

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
      symbol: folderImage,
      symbolSize: 40,
      edgeShape: 'polyline',
      edgeForkPosition: '50%',
      initialTreeDepth: 4,
      lineStyle: {
        width: 3,
      },
      label: {
        backgroundColor: '#fff',
        position: 'left',
        verticalAlign: 'middle',
        align: 'right',
      },
      leaves: {
        label: {
          position: 'right',
          verticalAlign: 'middle',
          align: 'left',
        },
      },
      emphasis: {
        focus: 'descendant',
      },
      expandAndCollapse: true,
      animationDuration: 550,
      animationDurationUpdate: 750,
    },
  ],
}

onMounted(() => {
  const pie = echarts.init(canvas.value)
  pie.setOption(option)
})
</script>

<template>
  <div ref="canvas" style="width: 500px; height: 400px"></div>
</template>
