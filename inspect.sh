#!/bin/sh
docker compose -f docker-compose.prod.yml logs backend -f --no-log-prefix
