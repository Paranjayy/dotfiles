#!/bin/bash

# OmniWM Layout Presets Script
# Author: Antigravity
# Usage: ./apply_preset.sh <coding|chill>

PRESET=$1

case "$PRESET" in
    coding)
        echo "Applying Coding layout..."
        open -a Zed
        open -a Ghostty
        sleep 0.6

        # Move Zed to workspace 2
        ZED_WIN=$(/opt/homebrew/bin/omniwmctl query windows --bundle-id "dev.zed.Zed" --format json | /Users/paranjay/.local/bin/jq -r '.result.payload.windows[0].id')
        if [ -n "$ZED_WIN" ] && [ "$ZED_WIN" != "null" ]; then
            /opt/homebrew/bin/omniwmctl window focus "$ZED_WIN"
            /opt/homebrew/bin/omniwmctl command move-column-to-workspace 2
        fi

        # Move Ghostty to workspace 2
        GHOSTTY_WIN=$(/opt/homebrew/bin/omniwmctl query windows --bundle-id "com.mitchellh.ghostty" --format json | /Users/paranjay/.local/bin/jq -r '.result.payload.windows[0].id')
        if [ -n "$GHOSTTY_WIN" ] && [ "$GHOSTTY_WIN" != "null" ]; then
            /opt/homebrew/bin/omniwmctl window focus "$GHOSTTY_WIN"
            /opt/homebrew/bin/omniwmctl command move-column-to-workspace 2
        fi

        # Focus workspace 2
        /opt/homebrew/bin/omniwmctl command switch-workspace 2
        ;;

    chill)
        echo "Applying Chill layout..."
        open -a Spotify
        open -a Safari
        sleep 0.6

        # Move Spotify to workspace 8
        SPOTIFY_WIN=$(/opt/homebrew/bin/omniwmctl query windows --bundle-id "com.spotify.client" --format json | /Users/paranjay/.local/bin/jq -r '.result.payload.windows[0].id')
        if [ -n "$SPOTIFY_WIN" ] && [ "$SPOTIFY_WIN" != "null" ]; then
            /opt/homebrew/bin/omniwmctl window focus "$SPOTIFY_WIN"
            /opt/homebrew/bin/omniwmctl command move-column-to-workspace 8
        fi

        # Move Safari to workspace 8
        SAFARI_WIN=$(/opt/homebrew/bin/omniwmctl query windows --bundle-id "com.apple.Safari" --format json | /Users/paranjay/.local/bin/jq -r '.result.payload.windows[0].id')
        if [ -n "$SAFARI_WIN" ] && [ "$SAFARI_WIN" != "null" ]; then
            /opt/homebrew/bin/omniwmctl window focus "$SAFARI_WIN"
            /opt/homebrew/bin/omniwmctl command move-column-to-workspace 8
        fi

        # Focus workspace 8
        /opt/homebrew/bin/omniwmctl command switch-workspace 8
        ;;

    *)
        echo "Unknown preset: $PRESET"
        exit 1
        ;;
esac
