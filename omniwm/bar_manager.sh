#!/bin/bash

# Dynamic workspace-bar helper for OmniWM and Nehir.
# Implementation: show while holding, hide 5s after release.
# This script uses idempotent logic (check-then-toggle) with whichever
# window manager binary is available.

LOCK_FILE="/tmp/omniwm_bar_hold.lock" # Present while holding
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Prefer OmniWM when available, then fall back to Nehir.
find_ctl_bin() {
    for candidate in \
        "/Applications/OmniWM.app/Contents/MacOS/omniwmctl" \
        "$(command -v omniwmctl 2>/dev/null)" \
        "/Applications/Nehir.app/Contents/MacOS/nehirctl" \
        "$(command -v nehirctl 2>/dev/null)" \
        "$SCRIPT_DIR/../.build/arm64-apple-macosx/debug/omniwmctl" \
        "$SCRIPT_DIR/../.build/arm64-apple-macosx/release/omniwmctl"
    do
        if [ -n "$candidate" ] && [ -x "$candidate" ]; then
            printf '%s\n' "$candidate"
            return 0
        fi
    done

    printf '%s\n' "omniwmctl"
}

CTL_BIN="$(find_ctl_bin)"

is_visible() {
    # Check if ANY monitor has isVisible: true
    "$CTL_BIN" query workspace-bar --format json | jq '.result.payload.monitors[].isVisible' 2>/dev/null | grep -q true
}

ensure_visible() {
    if ! is_visible; then
        "$CTL_BIN" command toggle-workspace-bar
    fi
}

ensure_hidden() {
    if is_visible; then
        "$CTL_BIN" command toggle-workspace-bar
    fi
}

case "$1" in
    --hold)
        touch "$LOCK_FILE"
        ensure_visible
        ;;
    --release)
        rm -f "$LOCK_FILE"
        # The Protector: Wait 5s before force-hiding
        (
            sleep 5
            # ONLY hide if NOT holding again (lock file removed) 
            if [ ! -f "$LOCK_FILE" ]; then
                ensure_hidden
            fi
        ) &
        ;;
    --toggle)
        "$CTL_BIN" command toggle-workspace-bar
        ;;
    --reset)
        rm -f "$LOCK_FILE"
        ensure_hidden
        ;;
esac
