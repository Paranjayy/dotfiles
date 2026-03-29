# 🛠️ Paranjay's Dotfiles

> Personal macOS development environment — shell, editors, tools, everything.

## What's This?

This is my **`~/.config/`** folder — a git repo that stores all my dotfiles. One `git push` backs up my entire dev setup. One `git pull` + `./install.sh` on a new Mac and I'm ready to go.

## Quick Start

```bash
# On a new machine
git clone https://github.com/Paranjayy/dotfiles.git ~/.config
cd ~/.config
./install.sh          # Creates symlinks
source ~/.zshrc       # Reload shell
```

## Structure

```
~/.config/  ← (this repo, git tracked)
│
├── shell/
│   ├── zshrc              # Main shell config
│   ├── zshrc.local        # Machine-specific (not synced)
│   ├── zprofile           # Login shell paths
│   ├── zshenv             # Environment vars
│   ├── profile            # Generic profile
│   └── bashrc             # Bash config
│
├── git/
│   └── config             # Git config
│
├── tmux/
│   ├── tmux.conf          # Terminal multiplexer
│   └── scripts/           # Battery, CPU, workspace scripts
│
├── nvim/                  # Neovim (LazyVim)
├── ghostty/               # Ghostty terminal
├── fastfetch/             # System info
├── gh/                    # GitHub CLI
├── karabiner/             # Keyboard (Hyper key)
├── zed/                   # Zed editor
├── omniwm/                # Tiling WM
├── fzf/, fd/, pnpm/       # Tools
│
├── install.sh             # Symlink installer
└── .gitignore             # Excludes junk
```

## What's Installed

### Shell (Zsh)

| Feature | Tool |
|---------|------|
| Plugin manager | Zinit |
| Prompt | Starship |
| Fuzzy finder | FZF |
| Directory jumping | Zoxide |
| Autosuggestions | zsh-autosuggestions |
| Syntax highlighting | zsh-syntax-highlighting |

### Modern CLI Tools

| Old | New | Why |
|-----|-----|-----|
| `ls` | `eza` | Icons, git status |
| `cat` | `bat` | Syntax highlighting |
| `find` | `fd` | Simpler, faster |
| `grep` | `ripgrep` | Blazing fast |
| `cd` | `zoxide` | Learns habits |

## Key Shortcuts

### Shell Aliases

```bash
.., ..., ~        # Navigation
ll, lt            # Listing (eza)
gst, gco, gp, gl  # Git
tms, dev, work    # Tmux workspaces
bi, ba, bro       # Bun
```

### Tmux (Prefix: Ctrl+b)

```
Ctrl+b |     Split vertical
Ctrl+b -     Split horizontal
Ctrl+b h/j/k/l   Navigate
Ctrl+b z     Zoom
Ctrl+b g     Lazygit
```

## Daily Workflow

```bash
# 1. Edit config
nano ~/.config/shell/zshrc

# 2. Test it
source ~/.zshrc

# 3. Save & push
cd ~/.config
git add -A
git commit -m "add new alias"
git push
```

## Customization

### Machine-Specific (`zshrc.local` — not synced)

```bash
export FASTFETCH_COUNTDOWN_DATE="2026-08-13"
export FASTFETCH_QUOTE="Build something that matters today."
```

### Adding Tools

1. Add config to `~/.config/toolname/`
2. Update `.gitignore` if needed
3. `git add -A && git commit && git push`

## FAQ

**Where are secrets?**
→ In `.gitignore`. Never committed.

**What about machine-specific stuff?**
→ `shell/zshrc.local` (gitignored). Use `zshrc.local.template`.

**How to restore on new Mac?**
→ `git clone` → `./install.sh` → `source ~/.zshrc`

---

**Author:** Paranjay ([@paranjayy](https://github.com/Paranjayy))
