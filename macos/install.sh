#!/bin/bash
# ╔══════════════════════════════════════════════════════════════╗
# ║  Paranjay's Dotfiles Installer (macOS)                      ║
# ║  One command to set up everything on macOS                   ║
# ╚══════════════════════════════════════════════════════════════╝
set -e

BOLD='\033[1m'
GREEN='\033[32m'
CYAN='\033[36m'
YELLOW='\033[33m'
RED='\033[31m'
RESET='\033[0m'

DOTFILES_URL="https://github.com/Paranjayy/dotfiles"
DOTFILES_DIR="$HOME/.dotfiles"

info()  { echo -e "${CYAN}[i]${RESET} $1"; }
ok()    { echo -e "${GREEN}[✓]${RESET} $1"; }
warn()  { echo -e "${YELLOW}[!]${RESET} $1"; }

# ── Check macOS ───────────────────────────────────────────────
if [[ "$(uname)" != "Darwin" ]]; then
    echo -e "${RED}[✗] This script is for macOS only.${RESET}"
    exit 1
fi

# ── Install Homebrew ──────────────────────────────────────────
if ! command -v brew &>/dev/null; then
    info "Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi
ok "Homebrew ready"

# ── Packages ──────────────────────────────────────────────────
info "Installing packages..."
brew install git curl wget unzip
brew install neovim tmux fzf ripgrep fd bat eza jq yq
brew install node python3 rust go
brew install btop htop fastfetch lazygit
brew install starship zoxide
brew install --cask alacritty ghostty
brew install --cask obsidian firefox spotify
brew install --cask raycast karabiner-elements
ok "Packages installed"

# ── Clone dotfiles ────────────────────────────────────────────
info "Setting up dotfiles..."
if [ ! -d "$DOTFILES_DIR" ]; then
    git clone "$DOTFILES_URL" "$DOTFILES_DIR"
else
    (cd "$DOTFILES_DIR" && git pull)
fi

# ── Copy configs ──────────────────────────────────────────────
info "Copying configs..."

# Raycast
if [ -d "$DOTFILES_DIR/raycast" ]; then
    mkdir -p "$HOME/.config"
    cp -r "$DOTFILES_DIR/raycast" "$HOME/.config/" 2>/dev/null || true
fi

# Karabiner
if [ -d "$DOTFILES_DIR/karabiner" ]; then
    mkdir -p "$HOME/.config"
    cp -r "$DOTFILES_DIR/karabiner" "$HOME/.config/" 2>/dev/null || true
fi

# Shell
if [ -d "$DOTFILES_DIR/shell" ]; then
    cp "$DOTFILES_DIR/shell/"* "$HOME/" 2>/dev/null || true
fi

# Zsh
if [ -d "$DOTFILES_DIR/zsh" ]; then
    mkdir -p "$HOME/.config/zsh"
    cp -r "$DOTFILES_DIR/zsh/"* "$HOME/.config/zsh/" 2>/dev/null || true
fi

# Git
if [ -d "$DOTFILES_DIR/git" ]; then
    mkdir -p "$HOME/.config/git"
    cp "$DOTFILES_DIR/git/"* "$HOME/.config/git/" 2>/dev/null || true
fi

ok "Dotfiles copied"

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════${RESET}"
echo -e "${GREEN}  All done! Restart your terminal.             ${RESET}"
echo -e "${GREEN}═══════════════════════════════════════════════${RESET}"
