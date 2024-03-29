<script setup lang="ts">
import { ref, onMounted } from 'vue'

const cw = ref(0)
const ch = ref(0)
const fallingCharArr = ref<
  { value: string; x: number; y: number; speed: number }[]
>([])
const fontSize = ref(16)
const maxColums = ref(0)
const charArr = ['0', '1', '', '', '']
const ctx = ref<CanvasRenderingContext2D | null>(null)

const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min)
}

const randomFloat = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

const draw = (point: {
  value: string
  x: number
  y: number
  speed: number
}) => {
  point.value = charArr[randomInt(0, charArr.length)].toUpperCase()
  if (point.y < 0) point.speed = randomFloat(10, 20)

  if (ctx.value === null) return
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
  if (ctx.value === null) return
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

  const canvas = document.querySelector('canvas') as HTMLCanvasElement
  ctx.value = canvas.getContext('2d')

  canvas.width = cw.value
  canvas.height = ch.value

  for (let i = 0; i < maxColums.value; i++) {
    fallingCharArr.value.push({
      x: i * fontSize.value,
      y: randomFloat(-500, 0),
      value: '',
      speed: 0,
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

<template>
  <div id="box">
    <canvas ref="canvas"></canvas>
  </div>
</template>

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
