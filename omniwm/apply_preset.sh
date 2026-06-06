#!/bin/bash

# OmniWM Layout Presets Script
# Author: Antigravity
# Usage: ./apply_preset.sh <coding|chill>

# Ensure homebrew and standard paths are loaded
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Users/paranjay/.local/bin:$PATH"

PRESET=$1

# Helper function to wait for window
wait_for_window() {
    local bundle_id=$1
    for i in {1..20}; do
        local win_id=$(omniwmctl query windows --bundle-id "$bundle_id" --format json | jq -r '.result.payload.windows[0].id')
        if [ -n "$win_id" ] && [ "$win_id" != "null" ]; then
            echo "$win_id"
            return 0
        fi
        sleep 0.2
    done
    return 1
}

case "$PRESET" in
    coding)
        echo "Applying Coding layout..."
        open -a Zed
        open -a Ghostty

        # Wait for Zed window
        ZED_WIN=$(wait_for_window "dev.zed.Zed")
        if [ -n "$ZED_WIN" ]; then
            omniwmctl window focus "$ZED_WIN"
            omniwmctl command move-column-to-workspace 2
        fi

        # Wait for Ghostty window
        GHOSTTY_WIN=$(wait_for_window "com.mitchellh.ghostty")
        if [ -n "$GHOSTTY_WIN" ]; then
            omniwmctl window focus "$GHOSTTY_WIN"
            omniwmctl command move-column-to-workspace 2
        fi

        # Focus workspace 2
        omniwmctl workspace focus-name "2"
        ;;

    chill)
        echo "Applying Chill layout..."
        open -a Spotify
        open -a Safari

        # Wait for Spotify window
        SPOTIFY_WIN=$(wait_for_window "com.spotify.client")
        if [ -n "$SPOTIFY_WIN" ]; then
            omniwmctl window focus "$SPOTIFY_WIN"
            omniwmctl command move-column-to-workspace 8
        fi

        # Wait for Safari window
        SAFARI_WIN=$(wait_for_window "com.apple.Safari")
        if [ -n "$SAFARI_WIN" ]; then
            omniwmctl window focus "$SAFARI_WIN"
            omniwmctl command move-column-to-workspace 8
        fi

        # Focus workspace 8
        omniwmctl workspace focus-name "8"
        ;;

    *)
        echo "Unknown preset: $PRESET"
        exit 1
        ;;
esac
