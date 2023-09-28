# Linux Odyssey

## Requirements

- NodeJS
- Docker
- Yarn

## Installation

    git clone https://github.com/lancatlin/linux-odyssey.git
    cd linux-odyssey
    yarn install

## Development

Run everything (frontend, backend, db, swagger, quests):

    docker compose build
    docker compose up -d

## Testing

Run Cypress locally, using the current development containers:

    docker compose up -d
    yarn test:e2e

Run Cypress in container, create brand-new containers along with it:

    docker compose -f docker-compose.testing.yml run cypress

    # tearing off the containers
    docker compose -f docker-compose.testing.yml down

### Deployment

    docker compose -f docker-compose.prod.yml build
    docker compose -f docker-compose.prod.yml push

    # Server side
    docker compose -f docker-compose.prod.yml pull
    docker compose -f docker-compose.prod.yml up -d

## Standalone App (without Docker)

Source: `app/`

    # Connect to dev server (https://odyssey.wancat.cc)
    yarn app

    # Connect to localhost (http://localhost:3000)
    yarn app:local

    # Connect to anyhost
    API_ENDPOINT=http://example.com yarn app:local

## Swagger

    docker compose up -d swagger

Open http://localhost:8080 to open Swagger

## CLI terminal client (Docker not required)

    yarn cli
    Usage: client [options] [command]

    Options:
    -s, --session <string>  Session ID
    -c, --create            Create a new session
    -h, --host <string>     Server host (default: "http://localhost:3000")
    --help                  display help for command

    Commands:
    list                    List all sessions

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
