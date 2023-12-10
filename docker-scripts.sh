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
  if [ "$1" = "--build" ]; then
    docker compose -f docker-compose.testing.yml build
  fi
  docker compose -f docker-compose.testing.yml run --rm cypress
}

down() {
  docker compose -f docker-compose.testing.yml down
}

dump() {
  # Define service name and dump directory name
  SERVICE_NAME="db"
  DUMP_NAME="mongodump-$(date --iso).archive"
  CONTAINER_ID=$(docker compose ps -q $SERVICE_NAME)

  # Fetch credentials from Docker environment variables
  MONGO_URL=$(docker compose exec -T backend printenv MONGO_URL)
  echo mongo uri: $MONGO_URL

  # Dump MongoDB data using credentials
  docker compose exec -T $SERVICE_NAME sh -c "mongodump --gzip --archive=/tmp/$DUMP_NAME -d odyssey-test" &&

  # Copy the dump from the container to the host
  # Note: You will need to know the exact container name for this step
  docker cp ${CONTAINER_ID}:/tmp/$DUMP_NAME . &&

  echo "MongoDB data dumped successfully."
}

restore() {
  # Define service name and dump directory name
  SERVICE_NAME="db"
  DUMP_NAME=$1
  CONTAINER_ID=$(docker compose ps -q $SERVICE_NAME)

  # Copy the dump from the host to the container
  docker cp $DUMP_NAME ${CONTAINER_ID}:/tmp &&

  # Dump MongoDB data using credentials
  docker compose exec -T $SERVICE_NAME sh -c "mongorestore --gzip --archive=/tmp/$DUMP_NAME" &&

  echo "MongoDB data dumped successfully."
}
$@