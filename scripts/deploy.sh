#!/usr/bin/env bash
# Выкладка на VPS: сборка локально → rsync готового билда → pm2 reload → проверка.
# Секреты (/etc/trofik/trofik.env), база и загруженные фото (/var/lib/trofik)
# живут на сервере вне папки релиза, поэтому --delete их не касается.
set -euo pipefail

HOST="${DEPLOY_HOST:-root@45.153.191.149}"
APP_DIR=/var/www/trofik
cd "$(dirname "$0")/.."

npm run build

# Список того, что уходит на сервер. Если среди него окажется файл с секретами — стоп.
FILES=(.next node_modules public package.json package-lock.json next.config.js)
if find "${FILES[@]}" -path .next/cache -prune -o -path .next/dev -prune -o \
     \( -name '.env' -o -name '.env.*' -o -name '*.sqlite*' -o -name 'trofik.env' \) -print \
     | grep -v '^\.next/\(cache\|dev\)$' | grep -v '/node_modules/.*\.env\.example$' | grep -q .; then
  echo "СТОП: в выкладку попал файл с секретами или базой" >&2
  exit 1
fi

rsync -az --delete \
  --exclude='.next/cache' --exclude='.next/dev' --exclude='public/uploads' \
  "${FILES[@]}" ecosystem.config.js "$HOST:$APP_DIR/"

ssh "$HOST" "chown -R trofik:trofik $APP_DIR && \
  sudo -iu trofik bash -c 'cd $APP_DIR && (pm2 reload ecosystem.config.js --update-env || pm2 start ecosystem.config.js) && pm2 save'"

sleep 3
ssh "$HOST" "curl -s -o /dev/null -w 'главная: %{http_code}\n' http://127.0.0.1:3000/ && \
  curl -s -o /dev/null -w 'цены: %{http_code}\n' http://127.0.0.1:3000/sitemap.xml"
