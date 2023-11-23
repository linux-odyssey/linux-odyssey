# Linux Odyssey

[![Production](https://github.com/linux-odyssey/linux-odyssey/actions/workflows/production.yml/badge.svg)](https://github.com/linux-odyssey/linux-odyssey/actions/workflows/production.yml)
[![Staging](https://github.com/linux-odyssey/linux-odyssey/actions/workflows/staging.yml/badge.svg)](https://github.com/linux-odyssey/linux-odyssey/actions/workflows/staging.yml)

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

If you want to enable social login, you should have OAuth client token in a `.env` file:

    docker compose --env-file .env up -d

### Build Quest Images

In each quest folder, there is a `game.yml` file, which is the quest definition. And a optional `Dockerfile` to overwrite the base image. If you want to include additional files, put them in a `home` folder. The files in `home` will **not** be copied to the image automatically, you have to copy them in the `Dockerfile`.

    quests/
    ├── Dockerfile      # Base image
    ├── discover
    │   └── game.yml
    ├── helloworld
    │   ├── Dockerfile  # Overwrite the image
    │   ├── game.yml
    │   └── home        # Include additional files
    │       └── forgotten_scroll.txt
    ├── read
    │   └── game.yml
    └── spell
        ├── Dockerfile
        ├── game.yml
        └── home
            └── ancient_scroll.txt

To build all quests:

    yarn build:quests

The base image is built with docker-compose, so you can use `docker compose build base` to rebuild it. Once you rebuild the base image, you have to rebuild all quests.

## Testing

Run Cypress locally, using the current development containers:

    docker compose up -d
    yarn test:e2e

Run Cypress in container, create brand-new containers along with it:

    ./docker-scripts.sh test

    # or with building

    ./docker-scripts.sh test --build

    # tearing off the containers
    ./docker-scripts.sh down

### Deployment

    docker compose -f docker-compose.prod.yml build
    docker compose -f docker-compose.prod.yml push

    # Server side
    docker compose -f docker-compose.prod.yml pull
    docker compose -f docker-compose.prod.yml up -d

To enable social login, you should have OAuth client token in a `.env` file:
You can copy from `example.env`

    # .env
    BASE_URL=https://example.com
    GOOGLE_CLIENT_ID=...
    GOOGLE_CLIENT_SECRET=...

To enable it:

    docker compose --env-file .env -f docker-compose.prod.yml up -d

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
