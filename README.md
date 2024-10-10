# Linux Odyssey

[![Production](https://github.com/linux-odyssey/linux-odyssey/actions/workflows/production.yml/badge.svg)](https://github.com/linux-odyssey/linux-odyssey/actions/workflows/production.yml)
[![Staging](https://github.com/linux-odyssey/linux-odyssey/actions/workflows/staging.yml/badge.svg)](https://github.com/linux-odyssey/linux-odyssey/actions/workflows/staging.yml)

## Requirements

- NodeJS v20+
- Docker
- Yarn: v1.22

## Known Issues

- The player's terminal doesn't work correctly on Mac OS and Windows for now. Please use Linux or Virtual Machines. You can track [this issue](https://github.com/linux-odyssey/linux-odyssey/issues/165) for updates.
- MongoDB requires x86 architecture to run for v5+ versions. You can track [this issue](https://github.com/linux-odyssey/linux-odyssey/issues/166) for updates.

## Installation

    git clone https://github.com/lancatlin/linux-odyssey.git
    cd linux-odyssey
    yarn install

## Project Structures

1. **app**: frontend
2. **server**: backend
3. **quests**: tutorials scripts for each quest
4. **packages**: other packages
   1. **analytics**: admin dashboard to analyze collected data
   2. **constants**: some shared config values for app and server
   3. **container**: the script run in container to capture users' command
   4. **file-graph**: the algorithm to construct and modify file graph, used in both app and server
   5. **models**: definitions of MondoDB collections (data schema)
   6. **utils**: other utility code shared between packages
   7. **game (in the future)**: core logic of game playing, will be extracted from server

## Docker Setup

### Docker compose files explaination

1. **docker-compose.yml**: The one used for development. It sets up MongoDB and builds base quest image.
2. **docker-compose.prod.yml**: The one used for production deployment. It has a Nginx service, a backend, a database, an analytics service, and creates isolated networks for player containers.
3. **docker-compose.testing.yml**: Similar to production config, but sets up an one-time environment for end-to-end testing.

### Common Development Setup

This sets up a development database, and running development server for frontend and backend.

Pull the latest images:

    docker compose pull

Start the containers:

    docker compose up -d

This will start the db. it will automatically restarts by Docker.

Building quest images:

    yarn build:quests

### Build Quest Images in Details

In each quest folder, there is a `game.yml` file, which is the quest definition. And a optional `Dockerfile` can overwrite the base image. If you want to include additional files, put them in a `home` folder. The files in `home` will **not** be copied to the image automatically, you have to copy them in the `Dockerfile`.

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

### Mounting Host Directory

To improve the development experience, we can mount the host directory to the container in the pattern:

    /path/to/linux-odyssey/quests/${quest_id}/home:/home/commander

You can edit the files on your host, and the changes will be reflected in the container. This is disabled by default. To enable it, you can set the following environment variables:

    MOUNT_QUEST=true

## Development

Copy `.env.sample` to `.env` and customize it for your needs.

Build the whole project for the first time:

    yarn build

This will build the typescript for each package and the server.

Run dev server (frontend, backend):

    yarn dev

**IMPORTANT NOTE**: only the app and server have hot-reloading, other packages require manually running `yarn dev` in each package.

To develop analytics dashboard:

    yarn analytics

The default username and password is `alex` and `Alex1234`.

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

## Deployment

    # Build the images (only allowed for maintainers)
    docker compose -f docker-compose.prod.yml build
    docker compose -f docker-compose.prod.yml push

    # Server side
    docker compose -f docker-compose.prod.yml pull
    docker compose -f docker-compose.prod.yml up -d

To enable social login, you should have OAuth client token in a `.env` file:
You can copy from `.env.sample`
