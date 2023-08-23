#!/bin/sh

inspect() {
  # default to app, allow overriding by $1
  SERVICE=${1:-app}
  echo "Running docker-compose logs for service [$SERVICE]..."
  docker compose logs $SERVICE -f --no-log-prefix
}

clean() {
  containers=$(docker ps -a | grep 'quest-' | awk '{print $1}')
  echo $containers

  docker rm -f $containers
}

$@