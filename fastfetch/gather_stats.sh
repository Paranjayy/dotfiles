#!/bin/bash

CACHE_FILE="$HOME/.cache/fastfetch_stats.json"
mkdir -p "$(dirname "$CACHE_FILE")"

# Function to get Now Playing
get_now_playing() {
    ps -x | grep -E 'Music|Spotify' | grep -v grep > /dev/null && \
    osascript -e 'set musicState to "None"' \
              -e 'if application "Music" is running then tell application "Music" to set musicState to "🎵 " & name of current track & " - " & artist of current track' \
              -e 'if application "Spotify" is running then tell application "Spotify" to set musicState to "🎵 " & name of current track & " - " & artist of current track' \
              -e 'get musicState' || echo "None"
}

# Function to get Next Event
get_next_event() {
    pgrep -x 'Calendar' > /dev/null && \
    osascript -e 'tell application "Calendar"' \
              -e 'set nextEvent to "None"' \
              -e 'try' \
              -e 'set nextEvent to name of first event of (first calendar whose name is not "Birthdays") whose start date is greater than (current date) and start date is less than (current date + 1 * days)' \
              -e 'end try' \
              -e 'get nextEvent' \
              -e 'end tell' || echo "None"
}

# Function to get Active Windows
get_active_windows() {
    osascript -e 'tell application "System Events" to get count of (every window of every process whose visible is true)'
}

# Function to get Battery Stats
get_battery_stats() {
    # Consolidate multiple system_profiler calls if possible, but ioreg is faster
    local health=$(system_profiler SPPowerDataType | grep 'Maximum Capacity' | awk '{print $3}' | tr -d '\n')
    local cycles=$(system_profiler SPPowerDataType | grep 'Cycle Count' | awk '{print $3}' | tr -d '\n')
    local temp=$(ioreg -r -n AppleSmartBattery | grep 'Temperature" =' | awk '{printf "%.1f C", $3/10 - 273.15}')
    echo "{\"health\": \"$health\", \"cycles\": \"$cycles\", \"temp\": \"$temp\"}"
}

# Function to get Network Stats
get_network_stats() {
    local ip_data=$(curl -s --connect-timeout 2 https://api.ipify.org || echo "Offline")
    local loc_data=$(curl -s --connect-timeout 2 http://ip-api.com/line/?fields=city,countryCode | paste -sd ', ' - || echo "Unknown")
    local weather=$(curl --connect-timeout 2 -s 'wttr.in/Junagadh?format=%c+%t&m' || echo "Offline")
    echo "{\"public_ip\": \"$ip_data\", \"location\": \"$loc_data\", \"weather\": \"$weather\"}"
}

# Main gathering
NOW_PLAYING=$(get_now_playing)
NEXT_EVENT=$(get_next_event)
ACTIVE_WINDOWS=$(get_active_windows)
BATTERY=$(get_battery_stats)
NETWORK=$(get_network_stats)
PERIPHERALS=$(ioreg -rk 'BatteryPercent' | sed -n 's/.*"ProductName" = "\([^"]*\)".*"BatteryPercent" = \([^,]*\).*/\1: \2%/p' | paste -sd ', ' - || echo 'None')

cat <<EOF > "$CACHE_FILE"
{
  "now_playing": "$NOW_PLAYING",
  "next_event": "$NEXT_EVENT",
  "active_windows": "$ACTIVE_WINDOWS",
  "battery": $BATTERY,
  "network": $NETWORK,
  "peripherals": "$PERIPHERALS",
  "updated_at": $(date +%s)
}
EOF
