#!/bin/bash
# ==============================================================================
# Script: sync-external-deps.sh
# Description: This script automates the synchronization of external dependencies for the project. It supports both full repository checkouts and specific subfolder tracking using Git sparse-checkout. The script ensures that each dependency is either initialized or updated to the latest state from its respective remote repository.
# Usage: ./sync-external-deps.sh
# ==============================================================================

set -euo pipefail

# ------------------------------------------------------------------------------
# --- Dependency Registry Configuration ---
# ------------------------------------------------------------------------------
# Arguments: target_directory | subfolder_path (use "" for full repo) | repository_url | tracking_branch

register_dependencies() {
    # 1. Subfolder checkout with custom local target directory name
    add_dep "deps/supabase-docker"     "docker"          "https://github.com/supabase/supabase"              "master"
    
    # 2. Full repository checkout with custom local target directory name
    add_dep "deps/FOTA-Client-ESP32"   ""                "https://github.com/NodeWave-EA/FOTA-Client-ESP32.git" "refactor/codebase"
    
    # Add more entries here as needed, following the same pattern:
    # add_dep "local_target_dir" "subfolder_path_or_empty" "repository_url" "branch_name"
}

# ------------------------------------------------------------------------------
# --- Core Synchronization Logic ---
# ------------------------------------------------------------------------------

# Global staging arrays to hold parsed structural properties cleanly
TARGET_DIRS=()
SUBFOLDERS=()
URLS=()
BRANCHES=()

# Pipeline configuration populator
add_dep() {
    TARGET_DIRS+=("$1")
    SUBFOLDERS+=("${2:-}") # Defaults to empty string if missing
    URLS+=("$3")
    BRANCHES+=("$4")
}

sync_dependency() {
    local target_dir="$1"
    local subfolder_path="$2"
    local repo_url="$3"
    local branch="$4"
    
    local execution_root
    execution_root="$(pwd)"

    printf "[INFO] Processing tracking target: %s -> %s\n" "$repo_url" "$target_dir"

    # Self-healing layer: Eliminate empty or corrupted target directories
    if [ -d "$target_dir" ] && [ -z "$(ls -A "$target_dir")" ]; then
        printf "[WARN] [%s] Detecting uninitialized or corrupted directory. Resetting...\n" "$target_dir"
        rm -rf "$target_dir"
    fi

    # Case A: Initial Provisioning Setup
    if [ ! -d "$target_dir" ]; then
        printf "[INFO] [%s] Workspace directory not found. Initializing setup...\n" "$target_dir"
        
        # Scenario 1: Full Repository Clone
        if [ -z "$subfolder_path" ]; then
            printf "[INFO] [%s] Cloning full repository state (Branch: %s)...\n" "$target_dir" "$branch"
            git clone -q --depth=1 --branch="$branch" "$repo_url" "$target_dir"
            printf "[SUCCESS] [%s] Full dependency profile generated successfully.\n\n" "$target_dir"
        
        # Scenario 2: Specific Subfolder Tracking (Sparse-Checkout Engine)
        else
            printf "[INFO] [%s] Enforcing sparse-checkout constraints for object tree path: %s...\n" "$target_dir" "$subfolder_path"
            mkdir -p "$target_dir"
            cd "$target_dir"
            
            git init -q
            git remote add origin "$repo_url"
            
            git config core.sparseCheckout true
            git sparse-checkout set "$subfolder_path"
            
            git fetch --depth=1 --filter=blob:none origin "$branch"
            git checkout -q "$branch"
            printf "[SUCCESS] [%s] Subfolder tracking initialized successfully.\n\n" "$target_dir"
        fi
    
    # Case B: Incremental Update Sequence
    else
        printf "[INFO] [%s] Local checkout history confirmed. Pulling update deltas...\n" "$target_dir"
        cd "$target_dir"
        
        git pull -q --depth=1 origin "$branch"
        printf "[SUCCESS] [%s] Local working trees updated cleanly to current remote state.\n\n" "$target_dir"
    fi

    cd "$execution_root"
}

# --- Script Entrypoint ---
main() {
    printf "======================================================================\n"
    printf "Starting external workspace dependency verification sequence\n"
    printf "======================================================================\n\n"

    # Load configuration mappings into isolated stack states
    register_dependencies

    # Iterate through mapped dependencies structurally without string parsers
    for i in "${!TARGET_DIRS[@]}"; do
        sync_dependency "${TARGET_DIRS[i]}" "${SUBFOLDERS[i]}" "${URLS[i]}" "${BRANCHES[i]}"
    done

    printf "======================================================================\n"
    printf "Synchronization tasks executed completely.\n"
    printf "======================================================================\n"
}

main "$@"
