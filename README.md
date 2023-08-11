# Linux Odyssey

## Requirements

- NodeJS
- Docker
- Yarn

## Installation

```
git clone https://github.com/lancatlin/linux-odyssey.git
cd linux-odyssey
yarn install
```

## Create database

```
docker compose pull
docker compose up -d db
```

## Server

Source: `server/`

```
docker compose -f docker-compose.build.yml pull
docker compose up -d
# Open http://localhost:3000
```

### Build images

    docker compose build
    docker compose push

Game images:

```
docker compose -f docker-compose.build.yml build
docker compose -f docker-compose.build.yml push
```

## App

Source: `app/`

```
yarn app
# Open http://localhost:5173/
```

## Swagger

```
docker compose up -d swagger
```

Open http://localhost:8080 to open Swagger

## CLI terminal client

```
yarn cli
Usage: client [options] [command]

Options:
  -s, --session <string>  Session ID
  -c, --create            Create a new session
  -h, --host <string>     Server host (default: "http://localhost:3000")
  --help                  display help for command

Commands:
  list                    List all sessions
```

connet to recent session:

    yarn cli

connect to new session:

    yarn cli -c

connect to specific session:

    yarn cli -s 64d0de0367459c13004bc83f

connect to other host:

    yarn cli -h https://example.com

list sessions:

    yarn cli list
