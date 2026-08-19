#!/bin/bash
# Paranjay's Arch Linux Setup Script
# Run this on a fresh Arch install to get up and running

set -e
echo "==> Paranjay's Arch Linux Setup"

CORE_PKGS=(
  base linux linux-firmware linux-headers
  networkmanager network-manager-applet
  sudo vim nano git curl wget
  man-db man-pages base-devel
)

DISPLAY_PKGS=(
  hyprland hyprlock hypridle hyprpaper
  xdg-desktop-portal-hyprland uwsm
  waybar wofi dunst swww imv
  foot alacritty ghostty kitty
  nautilus niri
)

DEV_PKGS=(
  nodejs npm pnpm bun
  python python-pip go rust
  docker docker-compose neovim tmux
  gcc make cmake
)

TOOLS_PKGS=(
  btop htop fastfetch fzf ripgrep fd bat eza
  zip unzip p7zip jq yq tldr
  starship zoxide lazygit lazydocker
  chromium firefox spotify obsidian typora
)

FONTS_PKGS=(
  ttf-jetbrains-mono-nerd noto-fonts
  noto-fonts-emoji noto-fonts-cjk
)

echo "==> Installing core packages..."
sudo pacman -S --needed --noconfirm "${CORE_PKGS[@]}"

echo "==> Installing display packages..."
sudo pacman -S --needed --noconfirm "${DISPLAY_PKGS[@]}"

echo "==> Installing dev packages..."
sudo pacman -S --needed --noconfirm "${DEV_PKGS[@]}"

echo "==> Installing tools..."
sudo pacman -S --needed --noconfirm "${TOOLS_PKGS[@]}"

echo "==> Installing fonts..."
sudo pacman -S --needed --noconfirm "${FONTS_PKGS[@]}"

# AUR Helper
if ! command -v yay &> /dev/null; then
  echo "==> Installing yay..."
  cd /tmp && git clone https://aur.archlinux.org/yay-bin.git && cd yay-bin && makepkg -si --noconfirm
fi

echo "==> Enabling services..."
sudo systemctl enable --now NetworkManager
sudo systemctl enable --now docker

echo ""
echo "==> Setup complete! Log out and select your DE/WM."
