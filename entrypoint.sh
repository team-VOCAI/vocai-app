#!/usr/bin/env bash
set -e

npx prisma migrate deploy

if [ -n "$RUN_DB_SEED" ]; then
  npm run db:seed
fi

exec npm start
