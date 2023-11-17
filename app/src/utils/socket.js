import io from 'socket.io-client'

class SocketWrapper {
  constructor() {
    this.socket = null
    this.listeners = []
  }

  connect(session) {
    return new Promise((resolve, reject) => {
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

  on(event, callback) {
    this.listeners.push({ event, callback })
    if (this.socket) {
      this.socket.on(event, callback)
    }
  }

  bindListeners() {
    this.listeners.forEach(({ event, callback }) => {
      this.socket.on(event, callback)
    })
  }

  emit(event, data) {
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
