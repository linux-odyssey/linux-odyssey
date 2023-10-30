import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import socket from './socket'
import 'xterm/css/xterm.css'

class SocketTerminal {
  constructor(rows, cols) {
    this.term = new Terminal({
      rendererType: 'canvas', // 渲染类型
      rows, // 行数
      cols, // 不指定行数，自动回车后光标从下一行开始
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
    this.fitAddon = new FitAddon()
    this.term.loadAddon(this.fitAddon)
    this.fitAddon.fit()
    this.socket = socket
    this.socket.on('terminal', (message) => {
      this.term.write(message)
    })
    this.term.onData((key) => {
      this.socket.emit('terminal', key)
    })
  }

  resizeScreen() {
    this.fitAddon.fit()
  }

  mount(reference) {
    this.term.open(reference)
    this.term.focus()
    this.resizeScreen()
  }

  clear() {
    this.term.clear()
  }
}

export default new SocketTerminal(40, 100)
