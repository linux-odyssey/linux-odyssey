<template>
  <font-awesome-icon :icon="['fas', 'terminal']" class="text-text p-1" />
  <button class="text-text h-[5%]">Terminal</button>
  <div
    id="terminal"
    ref="terminal"
    class="bg-background-secondary h-[calc(100%-5%)] p-0.5"
  >
    <!-- <p class="text-text-primary">
      zeko@first-command<span class="text-text">:~$</span>
    </p> -->
  </div>
</template>
<script setup>
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { AttachAddon } from 'xterm-addon-attach'
import 'xterm/css/xterm.css'
import { io } from 'socket.io-client'
// import connect from 'server/src/client'

import { onMounted, ref } from 'vue'

const rows = ref(40)
const cols = ref(100)
const terminal = ref(null)

onMounted(() => {
  const term = new Terminal({
    rendererType: 'canvas', // 渲染类型
    rows: rows.value, // 行数
    cols: cols.value, // 不指定行数，自动回车后光标从下一行开始
    convertEol: true, // 启用时，光标将设置为下一行的开头
    // scrollback: 50, //终端中的回滚量
    disableStdin: false, // 是否应禁用输入
    // cursorStyle: "underline", //光标样式
    cursorBlink: true, // 光标闪烁
    theme: {
      foreground: '#ECECEC', // 字体
      background: '#000000', // 背景色
      cursor: 'help', // 设置光标
      lineHeight: 20,
    },
  })
  // const host = 'wss://odyssey.wancat.cc'
  const host = 'ws://localhost:3000'
  const socket = io(host, {
    query: {
      // session_id: sessionId,
      session_id: '64d0de0367459c13004bc83f',
    },
  })
  socket.on('connect', function open() {
    console.log('Connected to the server.')
  })
  socket.on('disconnect', function close() {
    console.log('Disconnected from the server.')
  })
  socket.on('message', (message) => {
    console.log(message)
    term.write(message)
  })
  term.onData((key) => {
    console.log(key)
    socket.send(key)
  })
  term.open(terminal.value)

  const fitAddon = new FitAddon()
  term.loadAddon(fitAddon)
  fitAddon.fit()
  function resizeScreen() {
    try {
      // 窗口大小改变时，触发xterm的resize方法使自适应
      fitAddon.fit()
    } catch (e) {
      console.log('e', e.message)
    }
  }
  window.addEventListener('resize', resizeScreen)
})
</script>
