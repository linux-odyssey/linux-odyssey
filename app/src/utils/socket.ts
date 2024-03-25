import { io, Socket } from 'socket.io-client'

class SocketWrapper {
  socket: Socket | null
  listeners: { event: any; callback: any }[]
  constructor() {
    this.socket = null
    this.listeners = []
  }

  connect(session: any) {
    return new Promise<void>((resolve, reject) => {
      this.disconnect()

      this.socket = io('', {
        query: {
          sessionId: session._id,
        },
      })

      this.socket.on('connect', () => {
        console.log('Socket connected to session', session._id)
      })

      this.socket.once('terminal', () => {
        resolve()
      })
      this.socket.on('connect_error', reject)
      this.bindListeners()
    })
  }

  on(event: any, callback: any) {
    this.listeners.push({ event, callback })
    if (this.socket) {
      this.socket.on(event, callback)
    }
  }

  bindListeners() {
    this.listeners.forEach(
      ({ event, callback }: { event: any; callback: any }) => {
        if (this.socket !== null) this.socket.on(event, callback)
      }
    )
  }

  emit(event: any, data: any) {
    if (!this.socket) {
      console.warn('Socket is not connected!')
      return
    }
    this.socket.emit(event, data)
  }

  disconnect() {
    if (this.socket) {
      this.socket.off()
      this.socket.disconnect()
    }
  }

  reset() {
    this.disconnect()
  }
}

export default SocketWrapper
