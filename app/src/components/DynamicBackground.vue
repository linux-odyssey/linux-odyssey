<template>
  <div id="box">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const cw = ref(0)
const ch = ref(0)
const fallingCharArr = ref([])
const fontSize = ref(16)
const maxColums = ref(0)
const charArr = ['0', '1', '', '', '']
const ctx = ref(null)

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min)
}

const randomFloat = (min, max) => {
  return Math.random() * (max - min) + min
}

const draw = (point) => {
  point.value = charArr[randomInt(0, charArr.length)].toUpperCase()
  if (point.y < 0) point.speed = randomFloat(10, 20)

  ctx.value.fillStyle = '#0F0'
  ctx.value.font = `${fontSize.value}px san-serif`
  ctx.value.fillText(point.value, point.x, point.y)

  point.y += point.speed
  if (point.y > ch.value) {
    point.y = randomFloat(-100, 0)
    point.speed = randomFloat(2, 8)
  }
}

const update = () => {
  ctx.value.fillStyle = 'rgba(0,0,0,0.05)'
  ctx.value.fillRect(0, 0, cw.value, ch.value)

  let i = fallingCharArr.value.length
  while (i--) {
    draw(fallingCharArr.value[i])
  }
  setTimeout(update, 25)
}

onMounted(() => {
  cw.value = document.documentElement.clientWidth
  ch.value = document.documentElement.clientHeight
  maxColums.value = cw.value / fontSize.value

  const canvas = document.querySelector('canvas')
  ctx.value = canvas.getContext('2d')

  canvas.width = cw.value
  canvas.height = ch.value

  for (let i = 0; i < maxColums.value; i++) {
    fallingCharArr.value.push({
      x: i * fontSize.value,
      y: randomFloat(-500, 0),
    })
  }

  window.addEventListener('resize', () => {
    cw.value = document.documentElement.clientWidth
    ch.value = document.documentElement.clientHeight
    maxColums.value = cw.value / fontSize.value
    canvas.width = cw.value
    canvas.height = ch.value
  })

  update()
})
</script>

<style scoped>
#box {
  position: relative;
  width: 100vw;
  height: 100vh;
}

canvas {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
