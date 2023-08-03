<script setup></script>

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
<script>
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
// import { AttachAddon } from 'xterm-addon-attach'
import { stdin, stdout, exit } from 'process'
import 'xterm/css/xterm.css'
import { io } from 'socket.io-client'
// import connect from 'server/src/client'

export default {
  name: 'TerminalPart',
  data() {
    return {
      term: '', // 保存terminal实例
      rows: 40,
      cols: 100,
    }
  },
  mounted() {
    this.initXterm()
  },
  methods: {
    initXterm() {
      const xthis = this
      const term = new Terminal({
        rendererType: 'canvas', // 渲染类型
        rows: xthis.rows, // 行数
        cols: xthis.cols, // 不指定行数，自动回车后光标从下一行开始
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
      const ws = 'wss://odyssey.wancat.cc'
      // const ws = 'ws://localhost:3000'
      const socket = io(ws, {
        query: {
          // session_id: sessionId,
          session_id: '64cb80132077b982b86bdc4f',
        },
      })
      socket.on('message', function incoming(data) {
        console.log(data)
      })
      socket.on('open', function open() {
        console.log('Connected to the server.')
      })
      // socket.on('message', function incoming(data) {
      //   stdout.write(data)
      // })
      socket.on('close', function close() {
        console.log('Disconnected from the server.')
        exit()
      })
      socket.on('message', (message) => {
        term.onData(socket.emit('input', message))
      })
      // const attachAddon = new AttachAddon(socket)
      // 创建terminal实例
      // term.loadAddon(attachAddon)
      term.open(this.$refs.terminal)
      // 换行并输入起始符 $
      term.prompt = () => {
        term.write('\r\n\x1b[33mLinux Odyssey$\x1b[0m ')
      }
      term.prompt()
      // canvas背景全屏
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
      xthis.term = term
      xthis.socket = socket
      xthis.runFakeTerminal()
    },
    runFakeTerminal() {
      const xthis = this
      const { term } = xthis
      if (term.xinitialized) return
      // 初始化
      term.xinitialized = true
      term.writeln('Welcome to \x1b[1;32mLinux Odyssey\x1b[0m!')
      term.prompt()
      // 添加事件监听器，支持输入方法
      term.onKey((e) => {
        const printable =
          !e.domEvent.altKey &&
          !e.domEvent.altGraphKey &&
          !e.domEvent.ctrlKey &&
          !e.domEvent.metaKey
        if (e.domEvent.keyCode === 13) {
          term.prompt()
        } else if (e.domEvent.keyCode === 8) {
          // back 删除的情况
          if (term.xcore.buffer.x > 2) {
            term.write('\b \b')
          }
        } else if (printable) {
          term.write(e.key)
        }
        console.log(1, 'print', e.key)
      })
      term.onData((key) => {
        // 粘贴的情况
        if (key.length > 1) term.write(key)
      })
    },
  },
}
</script>
