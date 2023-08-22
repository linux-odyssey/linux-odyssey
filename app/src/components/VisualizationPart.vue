<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import TreeChart from './TreeChart.vue'

const treeRef = ref(null)
let pos = { top: 0, left: 0, x: 0, y: 0 }

function mouseMoveHandler(e) {
  const dx = e.clientX - pos.x
  const dy = e.clientY - pos.y

  treeRef.value.scrollTop = pos.top - dy
  treeRef.value.scrollLeft = pos.left - dx
}

function mouseUpHandler() {
  treeRef.value.style.cursor = 'grab'
  treeRef.value.style.removeProperty('user-select')

  document.removeEventListener('mousemove', mouseMoveHandler)
  document.removeEventListener('mouseup', mouseUpHandler)
}

function mouseDownHandler(e) {
  treeRef.value.style.cursor = 'grabbing'
  treeRef.value.style.userSelect = 'none'

  pos = {
    left: treeRef.value.scrollLeft,
    top: treeRef.value.scrollTop,
    x: e.clientX,
    y: e.clientY,
  }

  document.addEventListener('mousemove', mouseMoveHandler)
  document.addEventListener('mouseup', mouseUpHandler)
}

onMounted(() => {
  treeRef.value.style.cursor = 'grab'
  treeRef.value.addEventListener('mousedown', mouseDownHandler)
})

onUnmounted(() => {
  treeRef.value.removeEventListener('mousedown', mouseDownHandler)
})
</script>

<template>
  <div
    id="tree"
    ref="treeRef"
    class="h-full w-full overflow-auto cursor-grabbing"
  >
    <TreeChart />
  </div>
</template>

<style>
::-webkit-scrollbar {
  display: none;
}
</style>
