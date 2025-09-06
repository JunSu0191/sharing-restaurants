#!/usr/bin/env bash
set -e

COMPOSE_FILE="docker-compose-dev.yml"

# 기본: DB만 올리기
if [ $# -eq 0 ]; then
  docker compose -f "$COMPOSE_FILE" up -d db
else
  docker compose -f "$COMPOSE_FILE" "$@"
fi