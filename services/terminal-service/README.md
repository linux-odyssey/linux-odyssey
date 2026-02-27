# Terminal Service

A lightweight terminal service for Linux Odyssey player containers, replacing SSH with a more efficient WebSocket-based solution.

## Features

- WebSocket-based terminal sessions
- PTY (pseudo-terminal) management
- Quest command execution
- File status and content inspection
- Direct integration with Traefik for frontend access

## Architecture

The service is designed to be lightweight and efficient, using:

- gorilla/websocket for WebSocket connections
- creack/pty for terminal management
- Traefik for reverse proxying

## Development

### Prerequisites

- Go 1.24 or later
- Docker and Docker Compose
- Traefik (for production deployment)

### Setup

1. Install dependencies:

```bash
go mod init github.com/linux-odyssey/linux-odyssey/terminal-service
go get github.com/gorilla/websocket
go get github.com/creack/pty
```

2. Build and run:

```bash
go build
./terminal-service
```

## Configuration

Configuration details will be added as the service develops.

## Security

The service implements security measures to ensure safe container access and command execution.

## License

Same as the main Linux Odyssey project.
