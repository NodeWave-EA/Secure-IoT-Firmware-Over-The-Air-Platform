#!/bin/sh
#
# Manage the FOTA platform stack (backend, dashboard, and layered Supabase).
# Comprehensive wrapper mapping all Docker Compose subcommands and option presets.
#

set -e

cd "$(dirname "$0")"

if [ ! -f docker-compose.yml ]; then
    echo "ERROR: docker-compose.yml symlink not found in $(pwd). Run 'sh run.sh env --dev' or '--prod' first." >&2
    exit 1
fi

CMD="${1:-help}"
[ "$#" -gt 0 ] && shift

case "$CMD" in
    # =========================================================================
    # Environment Management
    # =========================================================================
    env)
        sub="${1:-}"
        case "$sub" in
            --dev|dev)
                echo "==> Switching environment to DEVELOPMENT..."
                if [ -f "docker-compose.dev.yml" ]; then
                    ln -sf docker-compose.dev.yml docker-compose.yml
                    echo "  ✓ Updated root docker-compose.yml symlink -> docker-compose.dev.yml"
                else
                    echo "ERROR: docker-compose.dev.yml not found" >&2
                    exit 1
                fi
                # backend
                if [ -f "backend/.env.development" ]; then
                    ln -sf .env.development backend/.env
                    echo "  ✓ Updated backend/.env symlink -> backend/.env.development"
                fi
                # dashboard
                if [ -f "dashboard/.env.development" ]; then
                    ln -sf .env.development dashboard/.env
                    echo "  ✓ Updated dashboard/.env symlink -> dashboard/.env.development"
                fi
                # supabase
                if [ -f "supabase/.env.development" ]; then
                    ln -sf .env.development supabase/.env
                    echo "  ✓ Updated supabase/.env symlink -> supabase/.env.development"
                fi
                echo "Successfully switched to DEVELOPMENT mode."
                ;;
            --prod|prod)
                echo "==> Switching environment to PRODUCTION..."
                if [ -f "docker-compose.prod.yml" ]; then
                    ln -sf docker-compose.prod.yml docker-compose.yml
                    echo "  ✓ Updated root docker-compose.yml symlink -> docker-compose.prod.yml"
                else
                    echo "ERROR: docker-compose.prod.yml not found" >&2
                    exit 1
                fi
                # backend
                if [ -f "backend/.env.production" ]; then
                    ln -sf .env.production backend/.env
                    echo "  ✓ Updated backend/.env symlink -> backend/.env.production"
                fi
                # dashboard
                if [ -f "dashboard/.env.production" ]; then
                    ln -sf .env.production dashboard/.env
                    echo "  ✓ Updated dashboard/.env symlink -> dashboard/.env.production"
                fi
                # supabase
                if [ -f "supabase/.env.production" ]; then
                    ln -sf .env.production supabase/.env
                    echo "  ✓ Updated supabase/.env symlink -> supabase/.env.production"
                fi
                echo "Successfully switched to PRODUCTION mode."
                ;;
            *)
                echo "Usage: $(basename "$0") env [--dev | --prod]" >&2
                exit 1
                ;;
        esac
        ;;

    # =========================================================================
    # Lifecycle & Stack Commands (Up / Down / Recreate)
    # =========================================================================
    start|up)
        exec docker compose up -d --wait --build "$@"
        ;;
    up-no-build)
        exec docker compose up -d --wait "$@"
        ;;
    stop|down)
        exec docker compose down "$@"
        ;;
    down-volumes|down-v)
        exec docker compose down -v "$@"
        ;;
    down-all)
        echo "==> Stopping containers, removing volumes, orphans, and local images..."
        exec docker compose down --rmi all -v --remove-orphans "$@"
        ;;
    restart)
        exec docker compose restart "$@"
        ;;
    recreate)
        exec docker compose up -d --wait --build --force-recreate "$@"
        ;;
    create)
        exec docker compose create "$@"
        ;;
    start-containers)
        exec docker compose start "$@"
        ;;
    stop-containers)
        exec docker compose stop "$@"
        ;;
    pause)
        exec docker compose pause "$@"
        ;;
    unpause)
        exec docker compose unpause "$@"
        ;;
    kill)
        exec docker compose kill "$@"
        ;;

    # =========================================================================
    # Build & Image Management
    # =========================================================================
    build)
        exec docker compose build "$@"
        ;;
    build-no-cache)
        exec docker compose build --no-cache "$@"
        ;;
    pull)
        exec docker compose pull "$@"
        ;;
    push)
        exec docker compose push "$@"
        ;;
    images)
        exec docker compose images "$@"
        ;;

    # =========================================================================
    # Monitoring & Logging
    # =========================================================================
    status|ps)
        exec docker compose ps "$@"
        ;;
    logs)
        exec docker compose logs -f "$@"
        ;;
    logs-tail)
        exec docker compose logs --tail=100 -f "$@"
        ;;
    logs-timestamps)
        exec docker compose logs -f --timestamps "$@"
        ;;
    top)
        exec docker compose top "$@"
        ;;
    stats)
        exec docker compose stats "$@"
        ;;
    events)
        exec docker compose events "$@"
        ;;

    # =========================================================================
    # Execution & Interactive Debugging
    # =========================================================================
    exec)
        [ $# -eq 0 ] && { echo "Usage: $(basename "$0") exec <service> <command>" >&2; exit 1; }
        exec docker compose exec "$@"
        ;;
    interactive)
        [ $# -eq 0 ] && { echo "Usage: $(basename "$0") interactive <service>" >&2; exit 1; }
        exec docker compose exec -it "$1" sh
        ;;
    run)
        [ $# -eq 0 ] && { echo "Usage: $(basename "$0") run <service> <command>" >&2; exit 1; }
        exec docker compose run --rm "$@"
        ;;
    inspect)
        [ $# -eq 0 ] && { echo "Usage: $(basename "$0") inspect <service> [docker-inspect-args]" >&2; exit 1; }
        svc="$1"; shift
        cid=$(docker compose ps -q "$svc")
        [ -z "$cid" ] && { echo "Service '$svc' is not running" >&2; exit 1; }
        exec docker inspect "$cid" "$@"
        ;;
    printenv)
        [ $# -eq 0 ] && { echo "Usage: $(basename "$0") printenv <service>" >&2; exit 1; }
        svc="$1"
        cid=$(docker compose ps -q "$svc")
        [ -z "$cid" ] && { echo "Service '$svc' is not running" >&2; exit 1; }
        exec docker inspect --format='{{range .Config.Env}}{{println .}}{{end}}' "$cid"
        ;;
    cp)
        [ $# -lt 2 ] && { echo "Usage: $(basename "$0") cp <src> <dest>" >&2; exit 1; }
        exec docker compose cp "$@"
        ;;
    port)
        [ $# -eq 0 ] && { echo "Usage: $(basename "$0") port <service> [private_port]" >&2; exit 1; }
        svc="$1"; shift
        if [ $# -eq 0 ]; then
            # Automatically find exposed ports for the service using docker compose config & inspect
            cid=$(docker compose ps -q "$svc")
            [ -z "$cid" ] && { echo "Service '$svc' is not running" >&2; exit 1; }
            echo "==> Port mappings for service '$svc':"
            docker inspect --format='{{range $p, $conf := .NetworkSettings.Ports}}{{if $conf}}  {{$p}} -> {{range $conf}}{{.HostIp}}:{{.HostPort}} {{end}}{{else}}  {{$p}} (unmapped){{end}}{{end}}' "$cid"
        else
            # Pass through to native docker compose port if specific port provided
            exec docker compose port "$svc" "$@"
        fi
        ;;
    wait)
        exec docker compose wait "$@"
        ;;

    # =========================================================================
    # Configuration & Validation
    # =========================================================================
    config|compose-config)
        exec docker compose config "$@"
        ;;

    # =========================================================================
    # Help Menu
    # =========================================================================
    help|-h|--help)
        cat <<EOF
Usage: $(basename "$0") <command> [arguments]

Environment Commands:
  env --dev                 Switch symlinks and .env files to Development configuration
  env --prod                Switch symlinks and .env files to Production configuration

Lifecycle & Stack Commands:
  start                     Start stack with build and wait for healthchecks (up -d --wait --build)
  up-no-build               Start stack without rebuilding images (--wait)
  stop                      Stop containers (down)
  down-volumes              Stop containers and delete persistent database/cache volumes (-v)
  down-all                  Stop containers, remove volumes, orphans, and local images
  restart [service]         Restart entire stack or a specific service
  recreate                  Force recreate and restart all containers (--force-recreate)
  create                    Create containers without starting them
  start-containers          Start existing stopped containers
  stop-containers           Stop running containers without removing them
  pause / unpause           Pause or resume running containers
  kill                      Force stop containers immediately

Build & Image Commands:
  build [service]           Build or rebuild container services
  build-no-cache            Build services from scratch without using cache
  pull                      Pull updated base container images
  push                      Push service images to a registry
  images                    List images used by stack services

Monitoring & Logging Commands:
  status                    Show running container status (ps)
  logs [service]            Stream container logs live (logs -f)
  logs-tail                 Stream the last 100 lines of logs live
  logs-timestamps           Stream logs live with absolute timestamps
  top                       Display running processes of stack services
  stats                     Display live container resource usage statistics
  events                    Stream container lifecycle events in real time

Execution & Debugging Commands:
  exec <svc> <cmd>          Execute a command inside a running container shell
  run <svc> <cmd>           Run a one-off command in a temporary container (--rm)
  inspect <service>         Inspect container configuration directly via Docker
  printenv <service>        Print environment variables loaded inside a container
  cp <src> <dest>           Copy files/folders between local machine and containers
  port <svc> <port>         Print the public port mapped to a container port
  wait                      Block until containers stop

Configuration Commands:
  config                    Inspect the fully resolved Docker Compose compilation tree

EOF
        ;;
    *)
        echo "Unknown command: $CMD" >&2
        echo "Run '$(basename "$0") help' for usage instructions." >&2
        exit 1
        ;;
esac