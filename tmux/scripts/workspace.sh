#!/bin/bash
# ============================================
# Tmux Workspace Manager
# ============================================

TMUX_WORKSPACES="$HOME/.tmux/workspaces"
mkdir -p "$TMUX_WORKSPACES"

# Create a workspace from current directory
tmux-workspace() {
    local name="${1:-$(basename $(pwd))}"
    local dir="${2:-$(pwd)}"
    
    if tmux has-session -t "$name" 2>/dev/null; then
        tmux attach-session -t "$name"
    else
        tmux new-session -s "$name" -c "$dir"
    fi
}

# Quick workspaces
tmux-dev() { tmux-workspace "dev" "$HOME/Developer"; }
tmux-work() { tmux-workspace "work" "$HOME/Downloads/2work/dev"; }
tmux-dotfiles() { tmux-workspace "dotfiles" "$HOME/Developer/dotfiles"; }

# List workspaces
tmux-list() {
    echo "Active tmux sessions:"
    tmux list-sessions 2>/dev/null || echo "  No active sessions"
    echo ""
    echo "Quick start:"
    echo "  tms        - Main session (or create)"
    echo "  dev        - ~/Developer"
    echo "  work       - ~/Downloads/2work/dev"
    echo "  dotfiles   - ~/Developer/dotfiles"
}

# Alias for quick access
alias tw='tmux-workspace'
alias tl='tmux-list'
