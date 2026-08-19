#!/bin/bash
# High-fidelity 5s bar peek.
# Calls bar_manager.sh to ensure state sync.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

"$SCRIPT_DIR/bar_manager.sh" --hold
sleep 5
"$SCRIPT_DIR/bar_manager.sh" --release
