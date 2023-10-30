import io from 'socket.io-client'

class SocketWrapper {
  constructor() {
    this.socket = null
    this.listeners = []
  }

  connect(session) {
    if (this.socket) {
      this.socket.off()
      this.socket.disconnect()
    }

    this.socket = io('', {
      query: {
        session_id: session._id,
      },
    })

    this.socket.on('connect', () => {
      console.log('Socket connected to session', session._id)
    })

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected from session', session._id)
    })

    this.socket.on('error', (err) => {
      console.log('Socket error', err)
    })

    this.bindListeners()
  }

  on(event, callback) {
    this.listeners.push({ event, callback })
    if (this.socket) {
      this.socket.on(event, callback)
    }
  }

  once(event, callback) {
    if (this.socket) {
      this.socket.once(event, callback)
    }
  }

  bindListeners() {
    this.listeners.forEach(({ event, callback }) => {
      this.socket.on(event, callback)
    })
  }

  send(data) {
    this.socket.send(data)
  }

  emit(event, data) {
    this.socket.emit(event, data)
  }
}

export default SocketWrapper
