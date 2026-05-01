#!/bin/bash

CACHE_FILE="$HOME/.cache/fastfetch_stats.json"
GATHER_SCRIPT="$HOME/.config/fastfetch/gather_stats.sh"
TTL=300 # 5 minutes

# Check if cache exists
if [ ! -f "$CACHE_FILE" ]; then
    # Create it first time
    "$GATHER_SCRIPT"
fi

# Check TTL and trigger background update
last_update=$(jq -r '.updated_at // 0' "$CACHE_FILE")
current_time=$(date +%s)
if [ $((current_time - last_update)) -gt $TTL ]; then
    ( "$GATHER_SCRIPT" > /dev/null 2>&1 & )
fi

# Extract requested field
case "$1" in
    now_playing) jq -r '.now_playing' "$CACHE_FILE" ;;
    next_event) jq -r '.next_event' "$CACHE_FILE" ;;
    active_windows) jq -r '.active_windows' "$CACHE_FILE" ;;
    battery_health) jq -r '.battery.health' "$CACHE_FILE" ;;
    battery_cycles) jq -r '.battery.cycles' "$CACHE_FILE" ;;
    battery_temp) jq -r '.battery.temp' "$CACHE_FILE" ;;
    public_ip) jq -r '.network.public_ip' "$CACHE_FILE" ;;
    location) jq -r '.network.location' "$CACHE_FILE" ;;
    weather) jq -r '.network.weather' "$CACHE_FILE" ;;
    peripherals) jq -r '.peripherals' "$CACHE_FILE" ;;
    *) echo "Unknown field" ;;
esac
