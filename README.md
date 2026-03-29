# 🛠️ Paranjay's Dotfiles

> macOS development environment - shell, tmux, editors, CLI tools

## 📁 Structure

```
~/.config/  (this repo)
├── install.sh          # Symlink installer
├── shell/              # Zsh configs → ~/.zshrc, etc.
├── git/config          # → ~/.gitconfig
├── tmux/               # → ~/.tmux.conf
├── nvim/               # Neovim (LazyVim)
├── ghostty/            # Terminal
├── fastfetch/          # System info
├── gh/                 # GitHub CLI
├── karabiner/          # Keyboard (Hyper key)
├── zed/                # Zed editor
└── ... (more tools)
```

## 🚀 Install on New Mac

```bash
git clone https://github.com/Paranjayy/dotfiles.git ~/.config
cd ~/.config && ./install.sh
```

## 📦 Homebrew

```bash
brew install git gh curl wget jq yq htop tree watch
brew install eza bat ripgrep fd fzf zoxide dust duf dog httpie hyperfine tldr lazygit git-delta
brew install make cmake openssl gnupg sqlite postgresql@16 redis
brew install starship
brew install --cask ghostty font-jetbrains-mono-nerd-font zed
```

## 🔗 Key Aliases

| Alias | Command |
|-------|---------|
| `gst` | git status |
| `gco` | git checkout |
| `gp` | git push |
| `ll` | eza -la --icons --git |
| `tms` | tmux new-session -As main |
| `dev` | cd ~/Developer && tms |

## 🔑 Tmux Prefix: `Ctrl+b`

| Key | Action |
|-----|--------|
| `\|` | Vertical split |
| `-` | Horizontal split |
| `h/j/k/l` | Navigate panes |
| `z` | Zoom pane |
| `g` | Open lazygit |

---

**Author:** Paranjay ([@paranjayy](https://github.com/Paranjayy))
