#!/bin/bash
# Dotfiles installer - ~/.config/install.sh

set -e
XDG="${XDG_CONFIG_HOME:-$HOME/.config}"
BACKUP="$HOME/.dotfiles-backup/$(date +%Y%m%d_%H%M%S)"

link() { mkdir -p "$(dirname "$2")"; [[ -f "$2" || -L "$2" ]] && mv "$2" "$BACKUP/" 2>/dev/null; ln -sf "$1" "$2"; echo "✓ $2"; }

echo "Installing dotfiles..."

# Shell
link "$XDG/shell/zshrc" "$HOME/.zshrc"
link "$XDG/shell/zshrc.local" "$HOME/.zshrc.local"
link "$XDG/shell/zprofile" "$HOME/.zprofile"
link "$XDG/shell/zshenv" "$HOME/.zshenv"
link "$XDG/shell/profile" "$HOME/.profile"
link "$XDG/shell/bashrc" "$HOME/.bashrc"

# Git
link "$XDG/git/config" "$HOME/.gitconfig"

# Tmux
link "$XDG/tmux/tmux.conf" "$HOME/.tmux.conf"
mkdir -p "$HOME/.tmux"
for f in "$XDG/tmux/scripts/"*.sh; do link "$f" "$HOME/.tmux/$(basename "$f")"; done
chmod +x "$HOME/.tmux/"*.sh 2>/dev/null

echo ""
echo "Done! Run: source ~/.zshrc"
