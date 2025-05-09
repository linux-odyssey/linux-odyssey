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

  connect(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('Connecting to terminal', url)
      this.term.write('\r\n\x1B[1;32mConnecting to terminal\x1B[0m\r\n')
      this.socket = new ReconnectingWebSocket(url, [], {
        connectionTimeout: 5000,
        maxRetries: 10,
      })
      this.socket.onopen = () => {
        console.log('Connected to terminal')
        this.term.reset()
        this.term.write('\r\n\x1B[1;32mConnected to terminal\x1B[0m\r\n')
        resolve()
      }

      this.socket.onclose = () => {
        console.log('Disconnected from terminal')
      }

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
      this.socket.onmessage = (event) => {
        console.log('Received message from terminal')
        const data =
          typeof event.data === 'string'
            ? event.data
            : new TextDecoder().decode(event.data)
        this.term.write(data)
      }
    })
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

  send(message: string): void {
    if (this.socket) {
      this.socket.send(message)
    }
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
