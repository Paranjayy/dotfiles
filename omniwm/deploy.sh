#!/bin/bash

# OmniWM Config Deployment Script
# This script syncs your repository's local configuration with your system.

# Directories
REPO_CONF="/Users/paranjay/Developer/OmniWM/.config"
KARABINER_CONF="/Users/paranjay/.config/karabiner"
OMNIWM_CONF="/Users/paranjay/.config/omniwm"

# Create directories if they don't exist
mkdir -p "$KARABINER_CONF"
mkdir -p "$OMNIWM_CONF"

echo "🚀 Syncing configurations..."

# Sync Karabiner
if [ -f "$REPO_CONF/karabiner.json" ]; then
    cp -v "$REPO_CONF/karabiner.json" "$KARABINER_CONF/karabiner.json"
fi

# Sync OmniWM Settings
if [ -f "$REPO_CONF/omniwm/settings.json" ]; then
    cp -v "$REPO_CONF/omniwm/settings.json" "$OMNIWM_CONF/settings.json"
fi

if [ -f "$REPO_CONF/omniwm/settings.toml" ]; then
    cp -v "$REPO_CONF/omniwm/settings.toml" "$OMNIWM_CONF/settings.toml"
fi

echo "✅ Configurations deployed successfully! mun!"
