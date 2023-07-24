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

Open server first, then create a session by `POST /api/v1/sessions`

```bash
curl -X 'POST' \
  'http://localhost:3000/api/v1/sessions' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "quest_id": "helloworld"
}'
```

Then use the `_id` field in response

```
yarn cli [_id]
# example
yarn cli 64be226a39c0043cd1cdf7c2
```
