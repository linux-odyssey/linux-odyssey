# Linux Odyssey

[![Production](https://github.com/linux-odyssey/linux-odyssey/actions/workflows/production.yml/badge.svg)](https://github.com/linux-odyssey/linux-odyssey/actions/workflows/production.yml)
[![Staging](https://github.com/linux-odyssey/linux-odyssey/actions/workflows/staging.yml/badge.svg)](https://github.com/linux-odyssey/linux-odyssey/actions/workflows/staging.yml)

## TLDR

    yarn install
    cp .env.sample .env
    docker compose up -d
    yarn dev

## Requirements

- NodeJS v20+
- Docker
- Yarn: v1.22

## Known Issues

- MongoDB requires x86 architecture to run for v5+ versions. You can track [this issue](https://github.com/linux-odyssey/linux-odyssey/issues/166) for updates.

Windows user please refer to [docs/windows-setup.md](docs/windows-setup.md) for setup instructions.

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

## Configuration

The configuration is stored in the `.env` file. You can copy from the sample file.

    cp .env.sample .env

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

    docker compose build base

### Build Quest Images in Details

In each quest folder, there is a `game.yml` file, which is the quest definition.

If you want to include additional files, put them in a `home` folder. The files in `home` will be copied to the user's home on container creation automatically.

    quests/
    ├── Dockerfile      # Base image
    ├── entrypoint.sh   # Entrypoint for the container
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

An optional `Dockerfile` can overwrite the base image. You can use this to install additional dependencies or modify the environment.

Customized `entrypoint.sh` for each quest is not yet supported.

To build all quests:

    yarn build:quests

The base image is built with docker-compose, so you can use `docker compose build base` to rebuild it. Once you rebuild the base image, you have to rebuild all quests.

### Optional: Mounting Host Directory

To update the home content of a quest, simply re-create a new session will do. The home content is mounted and copied on container creation.

To further improve the development experience, we can mount the host directory to the container in the pattern:

    /path/to/linux-odyssey/quests/${quest_id}/home:/home/commander

You can edit the files on your host, and the changes will be reflected in the container. This is disabled by default. To enable it, you can set the following environment variables:

    MOUNT_QUEST=true

### Optional: Mounting terminal service & cmd-hook

To make the development of terminal services & cmd-hook smoother, we can enable `MOUNT_CLI` to mount the local binaries into container.

    MOUNT_CLI

And you can run `air` inside of `services/terminal-service` or `services/cmd-hook` to get auto recompiling.

## Development

Copy `.env.sample` to `.env` and customize it for your needs.

Run dev server (frontend, backend):

    yarn dev

To develop analytics dashboard:

    yarn analytics

The default username and password is `alex` and `Alex1234`.

## Testing

Unit tests:

    yarn test:unit

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

Create production env

    cp .env.prod.sample .env.prod

Edit `.env.prod`

    BASE_URL=https://yourdomain.com         # IMPORTANT to make login work
    SECRET_KEY=xxxx                         # Change it to something safe!

Start the service

    # Build the images (only allowed for maintainers)
    docker compose -f docker-compose.prod.yml build
    docker compose -f docker-compose.prod.yml push

    # Server side
    docker compose -f docker-compose.prod.yml pull
    yarn build:quests
    docker compose -f docker-compose.prod.yml up -d

### Necessary Configuration

To enable social login, you should have OAuth client token in a `.env` file:
You can copy from `.env.sample`

**YOU MUST CHANGE THE SECRET_KEY** in `.env` file.

    SECRET_KEY=your-secret-key

You can generate a random key by running

    yarn setup
