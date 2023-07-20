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
docker compose up -d
```

## Server

Source: `server/`

```
yarn server
# Open http://localhost:3000
```

## App

Source: `app/`

```
yarn app
# Open http://localhost:5173/
```

## CLI terminal client

Open server first, then

```
yarn cli
```
