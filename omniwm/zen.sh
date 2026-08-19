#!/bin/bash

# OmniWM Zen Toggle - Master Control Script

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STATE_FILE="/tmp/omniwm_zen_state"
CURRENT_STATE="off"
[ -f "$STATE_FILE" ] && CURRENT_STATE=$(cat "$STATE_FILE")

if [ "$CURRENT_STATE" == "off" ]; then
    # -- ENGAGE ZEN --
    # 1. Hide Workspace Bar using the current window-manager binding.
    "$SCRIPT_DIR/bar_manager.sh" --toggle
    # 2. Hide all other applications (Cmd+Opt+H)
    osascript -e 'tell application "System Events" to key code 4 using {command down, option down}'
    echo "on" > "$STATE_FILE"
    echo "🧘 Zen Mode Engaged."
else
    # -- DISENGAGE ZEN (RECOVER) --
    # 1. Show Workspace Bar (Toggle)
    "$SCRIPT_DIR/bar_manager.sh" --toggle
    # 2. Show all applications (Recover All)
    osascript -e 'tell application "System Events" to set visible of every process to true'
    echo "off" > "$STATE_FILE"
    echo "☀️ Zen Mode Disengaged."
fi
