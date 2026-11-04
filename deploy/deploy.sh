#!/usr/bin/env bash
# Runs ON THE VPS (as the `deploy` user) from /var/www/sharper-marketing.
# Usage: ./deploy.sh <image-tag>
# Only touches the `sharper-marketing` compose project; never other containers.
set -euo pipefail

TAG="${1:?usage: deploy.sh <image-tag>}"
cd "$(dirname "$0")"

COMPOSE=(docker compose -p sharper-marketing -f docker-compose.prod.yml --env-file .env)

# .env holds the runtime secrets; the image coordinates are managed by this script.
set_env() { # key value
  grep -v "^$1=" .env > .env.tmp || true
  echo "$1=$2" >> .env.tmp
  mv .env.tmp .env
  chmod 600 .env
}

PREVIOUS="$(grep '^IMAGE_TAG=' .env | cut -d= -f2- || true)"

wait_healthy() {
  local cid status
  for _ in $(seq 1 40); do
    cid="$("${COMPOSE[@]}" ps -q app)"
    status="$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "$cid" 2>/dev/null || echo none)"
    [ "$status" = "healthy" ] && return 0
    sleep 3
  done
  return 1
}

echo ">> Deploying tag $TAG (previous: ${PREVIOUS:-none})"

# Safety net before schema migrations: dump the DB (kept: last 10).
if [ -n "$PREVIOUS" ] && [ -n "$("${COMPOSE[@]}" ps -q db 2>/dev/null)" ]; then
  mkdir -p backups
  "${COMPOSE[@]}" exec -T db sh -c 'mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" --single-transaction "$MYSQL_DATABASE"' \
    | gzip > "backups/pre-${TAG}.sql.gz" || echo "!! backup failed (continuing)" >&2
  ls -1t backups/*.sql.gz 2>/dev/null | tail -n +11 | xargs -r rm --
fi

set_env IMAGE_TAG "$TAG"

"${COMPOSE[@]}" pull
"${COMPOSE[@]}" up -d --remove-orphans

if wait_healthy; then
  echo ">> Healthy."
  echo "${PREVIOUS}" > .previous_tag
  exit 0
fi

echo "!! New version failed its healthcheck." >&2
"${COMPOSE[@]}" logs --tail=60 app >&2 || true
if [ -n "$PREVIOUS" ]; then
  echo "!! Rolling back to $PREVIOUS" >&2
  set_env IMAGE_TAG "$PREVIOUS"
  "${COMPOSE[@]}" up -d --remove-orphans
fi
exit 1
