#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
RUNTIME_DIR="$PROJECT_DIR/.runtime"
PID_FILE="$RUNTIME_DIR/server.pid"
LOG_FILE="$RUNTIME_DIR/server.log"
HOST="${HOST:-0.0.0.0}"
PORT="${PORT:-3000}"

cd "$PROJECT_DIR"
mkdir -p "$RUNTIME_DIR"

if [[ -f "$PID_FILE" ]]; then
  old_pid="$(tr -cd '0-9' < "$PID_FILE")"
  if [[ -n "$old_pid" ]] && kill -0 "$old_pid" 2>/dev/null; then
    old_command="$(ps -p "$old_pid" -o command= 2>/dev/null || true)"
    if [[ "$old_command" == *"next"* ]]; then
      echo "Stopping existing service (PID $old_pid)..."
      kill "$old_pid"
      for _ in {1..20}; do
        kill -0 "$old_pid" 2>/dev/null || break
        sleep 0.25
      done
      if kill -0 "$old_pid" 2>/dev/null; then
        echo "Service did not stop in time. Please check PID $old_pid manually." >&2
        exit 1
      fi
    else
      echo "PID $old_pid is not a Next.js process; refusing to stop it." >&2
      exit 1
    fi
  fi
  rm -f "$PID_FILE"
fi

if [[ ! -d node_modules ]]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Building production bundle..."
npm run build

echo "Starting service on $HOST:$PORT..."
nohup node "$PROJECT_DIR/node_modules/next/dist/bin/next" start \
  --hostname "$HOST" --port "$PORT" >>"$LOG_FILE" 2>&1 &
server_pid=$!
echo "$server_pid" > "$PID_FILE"

for _ in {1..20}; do
  if curl -fsS "http://127.0.0.1:$PORT" >/dev/null 2>&1; then
    echo "Service restarted successfully."
    echo "Local URL: http://localhost:$PORT"
    echo "PID: $server_pid"
    echo "Log: $LOG_FILE"
    exit 0
  fi
  kill -0 "$server_pid" 2>/dev/null || break
  sleep 0.5
done

echo "Service failed to become ready. Check log: $LOG_FILE" >&2
tail -n 30 "$LOG_FILE" >&2 || true
exit 1
