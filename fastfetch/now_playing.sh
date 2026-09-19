#!/bin/bash
# Fast "Now Playing" lookup for fastfetch.
# - Exits immediately when neither Music nor Spotify is running
#   (also avoids launching them as a side effect).
# - Watchdog-kills a hung osascript after ~2s so `stats` never stalls
#   (Spotify's AppleScript endpoint intermittently blocks for seconds).

pgrep -xq "Music" || pgrep -xq "Spotify" || { echo "None"; exit 0; }

tmp=$(mktemp)
osascript \
    -e 'set musicState to "None"' \
    -e 'if application "Music" is running then' \
    -e 'tell application "Music"' \
    -e 'try' \
    -e 'set musicState to "🎵 " & name of current track & " - " & artist of current track' \
    -e 'end try' \
    -e 'end tell' \
    -e 'end if' \
    -e 'if application "Spotify" is running then' \
    -e 'tell application "Spotify"' \
    -e 'try' \
    -e 'set musicState to "🎵 " & name of current track & " - " & artist of current track' \
    -e 'end try' \
    -e 'end tell' \
    -e 'end if' \
    -e 'get musicState' >"$tmp" 2>/dev/null &
pid=$!
(sleep 2; kill -9 "$pid" 2>/dev/null) &
watcher=$!
wait "$pid" 2>/dev/null
kill "$watcher" 2>/dev/null
wait 2>/dev/null

out=$(cat "$tmp" 2>/dev/null)
rm -f "$tmp"
if [ -n "$out" ]; then
    printf '%s\n' "$out"
else
    echo "None"
fi
