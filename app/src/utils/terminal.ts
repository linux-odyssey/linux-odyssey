import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'

class SocketTerminal {
  private term: Terminal
  private fitAddon: FitAddon

  constructor() {
    this.term = new Terminal({
      convertEol: true,
      scrollback: 1000,
      fontSize: 16,
      theme: {
        foreground: '#ECECEC',
        background: '#000000',
        cursor: 'help',
      },
    })
    this.fitAddon = new FitAddon()
    this.term.loadAddon(this.fitAddon)
  }

  resizeScreen(): void {
    try {
      this.fitAddon.fit()
    } catch (e) {
      console.error('Failed to resize terminal:', e)
    }
  }

  mount(reference: HTMLElement): void {
    this.term.open(reference)
    this.resizeScreen()
  }

  write(message: string): void {
    this.term.write(message)
  }

  onData(callback: (data: string) => void): void {
    this.term.onData(callback)
  }

  focus(): void {
    this.term.focus()
  }

  reset(): void {
    this.term.reset()
  }
}

export default SocketTerminal
