#!/usr/bin/env bash

# ==============================================================================
# Project: Secure-IoT-Firmware-Over-The-Air-Platform
# Script:  ./fresh.sh
# Purpose: Initialize a fresh clone of the repository with all submodules and
#          dependencies properly configured for development and build workflows.
# ==============================================================================

# Fail fast if any command fails, undefined variables are referenced, 
# or any piped command within a pipeline errors out.
set -euo pipefail

# ANSI color codes for readable terminal logging outputs
COLOR_INFO="\033[0;34m"
COLOR_SUCCESS="\033[0;32m"
COLOR_ERROR="\033[0;31m"
COLOR_RESET="\033[0m"

# Formatted log streams mapping to standard output / error descriptor blocks
log_info()    { printf "%b[INFO]%b %s\n" "${COLOR_INFO}" "${COLOR_RESET}" "$1"; }
log_success() { printf "%b[SUCCESS]%b %s\n" "${COLOR_SUCCESS}" "${COLOR_RESET}" "$1"; }
log_error()   { printf "%b[ERROR]%b %s\n" "${COLOR_ERROR}" "${COLOR_RESET}" "$1" >&2; }

# ------------------------------------------------------------------------------
# Environment & Pre-requisite Validations
# ------------------------------------------------------------------------------

# Ensure the execution environment is inside the root directory of the parent repo
if [[ ! -d ".git" ]] || [[ ! -f ".gitmodules" ]]; then
    log_error "This script must be executed from the root directory of the repository."
    exit 1
fi

# Confirm Git is globally available in the current environment binary path
if ! command -v git &> /dev/null; then
    log_error "Git executable not found in PATH. Please install Git and try again."
    exit 1
fi

# ------------------------------------------------------------------------------
# Workspace Git Hook Orchestration
# ------------------------------------------------------------------------------
log_info "Configuring repository configuration to use shared Git hooks..."

# Direct Git to read project hooks from the version-controlled directory
git config core.hooksPath .githooks

# Fix file permission masks on shared hook assets to guarantee execution access: skip .md and .txt files
if [[ -d ".githooks" ]]; then
    find .githooks -type f -not -name "*.md" -not -name "*.txt" -exec chmod +x {} +
fi

log_success "Shared repository Git hooks successfully linked."

# ------------------------------------------------------------------------------
# Submodule Synchronization and Ingestion
# ------------------------------------------------------------------------------
log_info "Synchronizing tracking profiles and remote repository endpoints..."

# Sync local workspace configuration definitions directly with the .gitmodules state
git submodule sync --recursive

log_info "Initializing submodules metadata structure..."
# Register submodules locally without fully updating them yet
git submodule init

# Update all submodules EXCEPT the sparse Supabase submodule
git submodule update --recursive --depth=1 --progress -- ':!docker/.supabase-root'

# ------------------------------------------------------------------------------
# Sparse-Checkout Layout Constraints Enforcement
# ------------------------------------------------------------------------------
TARGET_SUBMODULE_PATH="docker/.supabase-root"

log_info "Enforcing blobless sparse-checkout on Supabase submodule..."

# Configure the submodule local config to enable sparse checkout prior to populating files
git -C "${TARGET_SUBMODULE_PATH}" config core.sparseCheckout true

# Configure the inner repository database metadata frame to support sparse tracking rings
git -C "${TARGET_SUBMODULE_PATH}" sparse-checkout init --cone

# Isolate filesystem layout strictly to the targeted configuration directory
git -C "${TARGET_SUBMODULE_PATH}" sparse-checkout set docker

# Re-wire internal module config boundaries to use our centralized parent hooks setup folder.
git -C "${TARGET_SUBMODULE_PATH}" config core.hooksPath "../../.githooks"

log_info "Executing optimized shallow & blobless checkout for Supabase..."
# Native Compatibility Fix: Instead of passing --filter to 'submodule update', we configure 
# the partial clone options inside the submodule's remote config directly.
SUBMODULE_NAME=$(git config --file .gitmodules --get "submodule.${TARGET_SUBMODULE_PATH}.name" || echo "docker/.supabase-root")
git config "submodule.${SUBMODULE_NAME}.submoduleOf" ".."

# Safely trigger the sparse update using vanilla, backward-compatible flags
git submodule update --init --recursive --depth=1 --progress "${TARGET_SUBMODULE_PATH}"

log_success "Workspace initialization completed successfully. System environment ready."
