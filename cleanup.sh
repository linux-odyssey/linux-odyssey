#!/bin/sh
containers=$(docker ps -a | grep 'quest-' | awk '{print $1}')
echo $containers

docker rm -f $containers