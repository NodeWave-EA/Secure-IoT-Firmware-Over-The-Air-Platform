#!/bin/bash
# ==============================================================================
# Script: sync-external-deps.sh
# Description: Performs an ultra-lightweight, shallow sparse-checkout to track
#              and sync a single subfolder from an external Git repository.
# Usage: ./sync-external-deps.sh
# ==============================================================================

# Exit immediately if any command fails, treating unset variables as an error
set -euo pipefail

# --- Configuration Constants ---
TARGET_DIR="test"
SUBFOLDER_PATH="docker"
REPO_URL="https://github.com/supabase/supabase"
BRANCH="master" # Note: Supabase uses 'master' as the default branch

# --- Operational Logic ---

# Self-healing mechanism: Remove the directory if a prior run left it empty or corrupted
if [ -d "$TARGET_DIR" ] && [ -z "$(ls -A "$TARGET_DIR")" ]; then
    printf "[INFO] Detecting uninitialized or corrupted directory. Performing reset...\n"
    rm -rf "$TARGET_DIR"
fi

# Case A: Initial Provisioning Setup
if [ ! -d "$TARGET_DIR" ]; then
    printf "[INFO] Initializing shallow sparse-checkout workspace for directory: %s\n" "$TARGET_DIR"
    mkdir -p "$TARGET_DIR"
    cd "$TARGET_DIR"
    
    # Initialize repository quietly without default branch configuration noise
    git init -q
    git remote add origin "$REPO_URL"
    
    # Enforce sparse-checkout layer rules prior to any remote connections
    git config core.sparseCheckout true
    git sparse-checkout set "$SUBFOLDER_PATH"
    
    # Execute network fetch limiting history to 1 commit (--depth=1) 
    # and stripping full commit object blobs (--filter=blob:none)
    printf "[INFO] Fetching HEAD commit layout for object path: %s\n" "$SUBFOLDER_PATH"
    git fetch --depth=1 --filter=blob:none origin "$BRANCH"
    
    # Populate the local working tree with fetched remote tracking branch state
    git checkout "$BRANCH"
    printf "[SUCCESS] Dependency tracking configured and sync completed.\n"

# Case B: Incremental Update Sequence
else
    printf "[INFO] Workspace directory exists. Initiating delta update sync...\n"
    cd "$TARGET_DIR"
    
    # Fetch and merge only the newest remote update without pulling historical baggage
    git pull --depth=1 origin "$BRANCH"
    printf "[SUCCESS] Local working files synchronized to current HEAD state.\n"
fi
