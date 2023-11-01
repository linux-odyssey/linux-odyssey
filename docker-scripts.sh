#!/bin/sh

inspect() {
  # default to app, allow overriding by $1
  SERVICE=${1:-backend}
  echo "Running docker-compose logs for service [$SERVICE]..."
  docker compose logs $SERVICE -f --no-log-prefix
}

list() {
  docker ps -a | grep 'quest-' | awk '{print $1}'
}

clean() {
  containers=$(list)
  echo $containers

  docker rm -f $containers
}

test() {
  if [ "$1" = "--build"]; then
    docker compose -f docker-compose.testing.yml build
  fi
  docker compose -f docker-compose.testing.yml run --rm cypress
}

down() {
  docker compose -f docker-compose.testing.yml down
}

$@