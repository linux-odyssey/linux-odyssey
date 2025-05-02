import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import ReconnectingWebSocket from 'reconnecting-websocket'
import 'xterm/css/xterm.css'

class SocketTerminal {
  private term: Terminal
  private fitAddon: FitAddon
  private socket: ReconnectingWebSocket | null = null

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
    this.term.onData((data) => {
      if (this.socket) {
        this.socket.send(data)
      }
    })
  }

  connect(url: string): void {
    console.log('Connecting to terminal', url)
    this.socket = new ReconnectingWebSocket(url)
    this.socket.onopen = () => {
      console.log('Connected to terminal')
      this.term.write('\r\n\x1B[1;32mConnected to terminal\x1B[0m\r\n')
    }

    this.socket.onclose = () => {
      console.log('Disconnected from terminal')
      this.term.write('\r\n\x1B[1;31mDisconnected from terminal\x1B[0m\r\n')
    }

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error)
      this.term.write(
        `\r\n\x1B[1;31mWebSocket error: ${'message' in error ? error.message : ''}\x1B[0m\r\n`
      )
    }
    this.socket.onmessage = (event) => {
      console.log('Received message from terminal')
      const data =
        typeof event.data === 'string'
          ? event.data
          : new TextDecoder().decode(event.data)
      this.term.write(data)
    }
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

  focus(): void {
    this.term.focus()
  }

  reset(): void {
    this.term.reset()
    this.socket?.close()
  }
}

export default SocketTerminal
