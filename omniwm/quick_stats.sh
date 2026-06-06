#!/bin/bash

# QuickStats Toggle Script for Karabiner + OmniWM
# Author: Antigravity

# Query windows for a Ghostty window with "QuickStats" title
QUICK_STATS_PID=$(/opt/homebrew/bin/omniwmctl query windows --format json | /Users/paranjay/.local/bin/jq -r '.result.payload.windows[] | select(.title == "QuickStats") | .pid' | head -n 1)

if [ -n "$QUICK_STATS_PID" ] && [ "$QUICK_STATS_PID" != "null" ]; then
    kill "$QUICK_STATS_PID"
else
    # Launch Ghostty with the title "QuickStats" running a menu-driven dashboard
    ghostty --title="QuickStats" -e "bash -c '
    while true; do
        clear
        echo -e \"\033[1;35m⚡ QUICK SYSTEM DASHBOARD ⚡\033[0m\"
        echo -e \"\033[1;30m---------------------------------------------------\033[0m\"
        fastfetch --logo none --key-color 35
        echo -e \"\033[1;30m---------------------------------------------------\033[0m\"
        echo -e \" \033[1;32m[h]\033[0m htop  |  \033[1;34m[p]\033[0m ping 8.8.8.8  |  \033[1;31m[q]\033[0m quit\"
        echo -e \"\033[1;30m---------------------------------------------------\033[0m\"
        read -n 1 -s opt
        if [ \"\$opt\" = \"h\" ]; then
            htop
        elif [ \"\$opt\" = \"p\" ]; then
            clear
            ping -c 5 8.8.8.8
            echo
            read -n 1 -s -p \"Press any key to return...\"
        elif [ \"\$opt\" = \"q\" ]; then
            break
        fi
    done
    '" &
fi
