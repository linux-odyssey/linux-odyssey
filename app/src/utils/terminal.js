import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
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
      foreground: '#ECECEC', // 字体
      background: '#000000', // 背景色
      cursor: 'help', // 设置光标
      fontSize: 18,
      fontWeight: 'bold',
    })
    this.fitAddon = new FitAddon()
    this.term.loadAddon(this.fitAddon)
    this.fitAddon.fit()
  }

  write(message) {
    this.term.write(message)
  }

  onData(callback) {
    this.term.onData(callback)
  }

  focus() {
    this.term.focus()
  }

  resizeScreen() {
    this.fitAddon.fit()
  }

  mount(reference) {
    this.term.open(reference)
    this.term.focus()
    this.resizeScreen()
  }

  reset() {
    this.term.reset()
  }
}

export default SocketTerminal
