#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel)"
SUPABASE_PATH="docker/.supabase-root"

cd "${ROOT_DIR}"

if [[ ! -f ".gitmodules" ]]; then
    printf '[ERROR] .gitmodules was not found in %s\n' "${ROOT_DIR}" >&2
    exit 1
fi

if ! command -v git >/dev/null 2>&1; then
    printf '[ERROR] Git executable not found in PATH.\n' >&2
    exit 1
fi

printf '[INFO] Synchronizing submodule configuration...\n'
git submodule sync --recursive

printf '[INFO] Initializing submodules...\n'
git submodule update --init --recursive

printf '[INFO] Restricting Supabase checkout to its docker directory...\n'
git -C "${SUPABASE_PATH}" sparse-checkout init --cone
git -C "${SUPABASE_PATH}" sparse-checkout set docker

printf '[INFO] Discarding all local submodule changes and untracked files...\n'
git submodule foreach --recursive 'git reset --hard && git clean -fdx'

printf '[INFO] Updating submodules to the latest remote commits...\n'
git submodule update --remote --checkout --force --recursive

printf '[INFO] Reapplying Supabase docker-only checkout...\n'
git -C "${SUPABASE_PATH}" sparse-checkout set docker

printf '[SUCCESS] Submodules are up to date.\n'
