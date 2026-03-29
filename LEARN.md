# 📚 Learn & Examples

> How to use everything in this dotfiles setup.

---

## Zsh Shell

### Custom Functions

```bash
# Create dir and cd into it
mkcd myproject
# → creates ~/myproject and cd's into it

# Extract any archive
extract archive.tar.gz
extract file.zip
extract package.deb

# Countdown to date
remaining_days 2026-08-13
# → Shows "47 days --> Saturday, August 13, 2026"

# Check if command exists
command_exists docker
# → returns 0 if exists, 1 if not
```

### Adding Aliases

Edit `~/.config/shell/zshrc`, add:

```bash
# Project shortcuts
alias myproj='cd ~/Developer/myproject'

# Git shortcuts
alias gs='git status -sb'
alias amend='git commit --amend --no-edit'

# Docker shortcuts
alias dc='docker compose'
alias dps='docker ps --format "table {{.Names}}\t{{.Status}}"'
```

Then: `source ~/.zshrc`

---

## FZF (Fuzzy Finder)

### Built-in Shortcuts

| Shortcut | What it does |
|----------|--------------|
| `Ctrl+R` | Search command history |
| `Ctrl+T` | Find files |
| `Alt+C` | Change to directory |
| `**` + Tab | Trigger completion |

### Examples

```bash
# Find and open a file
vim **<Tab>

# Search history for npm command
# Press Ctrl+R, type "npm"

# Find all .json files in src/
cd src/**<Tab>
```

---

## Tmux

### Daily Commands

```bash
# Start/reconnect to main session
tms

# List sessions
tml

# Start specific workspace
dev      # ~/Developer
work     # ~/Downloads/2work/dev

# New named session
tmux new -s myproject

# Attach to session
tmux attach -t myproject
```

### Inside Tmux

```
# Pane management
Ctrl+b |     Split vertical
Ctrl+b -     Split horizontal
Ctrl+b h     Move left
Ctrl+b j     Move down
Ctrl+b k     Move up
Ctrl+b l     Move right
Ctrl+b z     Zoom/unzoom pane
Ctrl+b x     Kill pane

# Window management
Ctrl+b c     New window
Ctrl+b ,     Rename window
Ctrl+b n     Next window
Ctrl+b p     Previous window

# Session
Ctrl+b d     Detach
Ctrl+b s     Switch session
Ctrl+b $     Rename session

# Reload config
Ctrl+b r
```

### Workspace Manager

```bash
# In shell
source ~/.tmux/workspace.sh

# Quick workspaces
tw dev          # Start/attach dev workspace
tw work         # Start/attach work workspace
tw dotfiles     # Start/attach dotfiles workspace

# Or use aliases
dev            # cd ~/Developer && tms
work           # cd ~/Downloads/2work/dev && tms
tl             # List all sessions
```

---

## Git

### Aliases (in .gitconfig)

```bash
git st     # status
git co     # checkout
git br     # branch
git ci     # commit
git lg     # log --oneline --graph --decorate
```

### Commit Signing

All commits are GPG signed. Make sure your GPG key is configured:

```bash
gpg --list-secret-keys
# Should show key 35A408247C801F80
```

---

## Neovim (LazyVim)

### Key Mappings

| Key | Action |
|-----|--------|
| `Space` | Leader key |
| `Space ff` | Find files |
| `Space fb` | Find buffers |
| `Space sg` | Search grep |
| `Space /` | Search in file |
| `Space ee` | File explorer |
| `Space gd` | Go to definition |
| `Space gr` | References |
| `Space ca` | Code actions |
| `Space rr` | Rename |

### Common Tasks

```bash
# Open file
nvim filename.lua

# Open file tree
nvim .           # or Space ee

# Search across project
# Space sg, type query

# Git diff in file
# ]c / [c for next/prev hunk
# Space hp to preview hunk
```

---

## Ghostty Terminal

### Settings

```toml
font-family = "JetBrainsMono Nerd Font"
font-size = 13
command = tmux new-session -A -s main  # Auto-tmux
```

### Customization

Edit `~/.config/ghostty/config`:

```toml
# Change font
font-family = "FiraCode Nerd Font"
font-size = 14

# Change theme
theme = "One Dark"

# Startup command
command = /bin/zsh
```

---

## Karabiner (Hyper Key)

### What's a Hyper Key?

Caps Lock or Right Option held = `Ctrl + Option + Shift + Cmd`
Caps Lock tapped = `Escape`

This gives you a super-powered modifier for shortcuts without reaching.

### Usage

```
Hyper + H = Move window left (OmniWM)
Hyper + J = Move window down
Hyper + K = Move window up
Hyper + L = Move window right
```

---

## Fastfetch

Customizes the system info shown on shell startup.

Edit `~/.config/fastfetch/config.jsonc` to add/remove modules.

Edit `~/.config/shell/zshrc.local` for:
- Countdown date
- Custom quote

---

## Updating Dotfiles

```bash
cd ~/.config

# Make changes to any config
nano shell/zshrc

# Test
source ~/.zshrc

# Save
git add -A
git commit -m "add docker aliases"
git push
```

---

## Common Issues

### Zsh plugins not loading

```bash
rm -rf ~/.local/share/zinit
source ~/.zshrc  # Reinstalls automatically
```

### Tmux plugins not working

```bash
# Inside tmux, press:
Ctrl+b I    # (Shift+i) to install plugins
```

### FZF not working

```bash
brew reinstall fzf
$(brew --prefix)/opt/fzf/install
```

### Symlinks broken

```bash
cd ~/.config && ./install.sh
```

---

**Need help?** Open an issue on [GitHub](https://github.com/Paranjayy/dotfiles/issues).
