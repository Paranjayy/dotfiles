#!/bin/bash
# ╔══════════════════════════════════════════════════════════════╗
# ║  Paranjay's Dotfiles Installer                              ║
# ║  One command to set up everything on Arch Linux             ║
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
err()   { echo -e "${RED}[✗]${RESET} $1"; }

# ── Check if running on Arch ────────────────────────────────────
if [ ! -f /etc/arch-release ]; then
    err "This script is for Arch Linux only."
    exit 1
fi

# ── Install yay if missing ─────────────────────────────────────
install_yay() {
    if command -v yay &>/dev/null; then
        ok "yay already installed"
        return
    fi
    info "Installing yay (AUR helper)..."
    sudo pacman -S --needed --noconfirm git base-devel
    git clone https://aur.archlinux.org/yay-bin.git /tmp/yay-bin
    (cd /tmp/yay-bin && makepkg -si --noconfirm)
    rm -rf /tmp/yay-bin
    ok "yay installed"
}

# ── Package lists ──────────────────────────────────────────────
CORE_PKGS=(
    networkmanager network-manager-applet
    sudo vim nano git curl wget unzip
)

DISPLAY_PKGS=(
    hyprland hyprlock hypridle hyprpaper
    xdg-desktop-portal-hyprland uwsm
    waybar wofi dunst swww
    foot alacritty ghostty kitty
    niri
    mako swayosd brightnessctl playerctl
)

DEV_PKGS=(
    nodejs npm pnpm bun
    python python-pip
    docker docker-compose
    neovim tmux
)

TOOLS_PKGS=(
    btop htop fastfetch fzf ripgrep fd bat eza
    zip unzip p7zip jq yq tldr
    starship zoxide lazygit lazydocker
    chromium firefox
)

FONTS_PKGS=(
    ttf-jetbrains-mono-nerd noto-fonts
    noto-fonts-emoji noto-fonts-cjk
)

# ── Install packages ──────────────────────────────────────────
install_packages() {
    local name=$1
    shift
    local pkgs=("$@")
    
    info "Installing $name..."
    yay -S --needed --noconfirm "${pkgs[@]}" 2>/dev/null || \
    sudo pacman -S --needed --noconfirm "${pkgs[@]}"
    ok "$name done"
}

# ── Enable services ───────────────────────────────────────────
enable_services() {
    info "Enabling services..."
    sudo systemctl enable --now NetworkManager 2>/dev/null || true
    sudo systemctl enable --now docker 2>/dev/null || true
    sudo usermod -aG docker "$USER" 2>/dev/null || true
    ok "Services enabled"
}

# ── Copy dotfiles ─────────────────────────────────────────────
setup_dotfiles() {
    info "Setting up dotfiles..."
    
    if [ ! -d "$DOTFILES_DIR" ]; then
        git clone "$DOTFILES_URL" "$DOTFILES_DIR"
    else
        (cd "$DOTFILES_DIR" && git pull)
    fi
    
    # Hyprland
    mkdir -p "$HOME/.config/hypr"
    cp -r "$DOTFILES_DIR/linux/hypr/"* "$HOME/.config/hypr/"
    
    # Niri
    mkdir -p "$HOME/.config/niri"
    cp "$DOTFILES_DIR/linux/niri/config.kdl" "$HOME/.config/niri/"
    
    # Waybar
    mkdir -p "$HOME/.config/waybar"
    cp "$DOTFILES_DIR/linux/waybar/"* "$HOME/.config/waybar/"
    
    # Terminals
    mkdir -p "$HOME/.config/alacritty" "$HOME/.config/kitty" "$HOME/.config/foot" "$HOME/.config/ghostty"
    cp "$DOTFILES_DIR/linux/alacritty/"* "$HOME/.config/alacritty/" 2>/dev/null || true
    cp "$DOTFILES_DIR/linux/kitty/"* "$HOME/.config/kitty/" 2>/dev/null || true
    cp "$DOTFILES_DIR/linux/foot/"* "$HOME/.config/foot/" 2>/dev/null || true
    cp "$DOTFILES_DIR/linux/ghostty/"* "$HOME/.config/ghostty/" 2>/dev/null || true
    
    # Tools
    mkdir -p "$HOME/.config/btop" "$HOME/.config/lazygit" "$HOME/.config/tmux" "$HOME/.config/fastfetch"
    cp "$DOTFILES_DIR/linux/btop/"* "$HOME/.config/btop/" 2>/dev/null || true
    cp "$DOTFILES_DIR/linux/lazygit/"* "$HOME/.config/lazygit/" 2>/dev/null || true
    cp "$DOTFILES_DIR/linux/tmux/"* "$HOME/.config/tmux/" 2>/dev/null || true
    cp "$DOTFILES_DIR/linux/fastfetch/"* "$HOME/.config/fastfetch/" 2>/dev/null || true
    
    # Notifications
    mkdir -p "$HOME/.config/mako"
    cp "$DOTFILES_DIR/linux/mako/"* "$HOME/.config/mako/" 2>/dev/null || true
    
    # GTK
    mkdir -p "$HOME/.config/gtk-3.0" "$HOME/.config/gtk-4.0"
    cp "$DOTFILES_DIR/linux/gtk/gtk3.css" "$HOME/.config/gtk-3.0/gtk.css" 2>/dev/null || true
    cp "$DOTFILES_DIR/linux/gtk/gtk3-settings.ini" "$HOME/.config/gtk-3.0/settings.ini" 2>/dev/null || true
    cp "$DOTFILES_DIR/linux/gtk/gtk4.css" "$HOME/.config/gtk-4.0/gtk.css" 2>/dev/null || true
    cp "$DOTFILES_DIR/linux/gtk/gtk4-settings.ini" "$HOME/.config/gtk-4.0/settings.ini" 2>/dev/null || true
    
    # Git
    mkdir -p "$HOME/.config/git"
    cp "$DOTFILES_DIR/linux/git/"* "$HOME/.config/git/" 2>/dev/null || true
    
    ok "Dotfiles copied"
}

# ── Main ──────────────────────────────────────────────────────
main() {
    echo ""
    echo -e "${BOLD}${CYAN}╔══════════════════════════════════════════════╗${RESET}"
    echo -e "${BOLD}${CYAN}║  Paranjay's Dotfiles Installer               ║${RESET}"
    echo -e "${BOLD}${CYAN}╚══════════════════════════════════════════════╝${RESET}"
    echo ""
    
    install_yay
    install_packages "core packages" "${CORE_PKGS[@]}"
    install_packages "display packages" "${DISPLAY_PKGS[@]}"
    install_packages "dev packages" "${DEV_PKGS[@]}"
    install_packages "tools" "${TOOLS_PKGS[@]}"
    install_packages "fonts" "${FONTS_PKGS[@]}"
    enable_services
    setup_dotfiles
    
    echo ""
    ok "All done! Log out and select Hyprland/Niri/KDE."
    echo ""
}

main "$@"
