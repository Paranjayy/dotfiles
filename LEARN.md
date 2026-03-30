# 📚 Learn & Examples

> How to use everything in this dotfiles setup.

---

## 🤔 What Is What?

Before diving in, here's what each tool actually does in plain English:

### Shell Layer

| What | What It Does | Why You Have It |
|------|--------------|-----------------|
| **Zsh** | Your terminal shell - the thing that runs commands | Better than bash: plugins, smarter completions, history |
| **Zinit** | Installs Zsh plugins | Fast plugin loader, lazy loads everything |
| **Starship** | Pretty prompt with info | Shows git branch, exit codes, language versions |
| **FZF** | Fuzzy search anything | Ctrl+R to find any command, Ctrl+T to find any file |
| **Zoxide** | Smarter `cd` | Remembers where you go, `z proj` jumps to ~/projects |
| **direnv** | Per-directory env vars | Load `.env` files automatically per project |

### Terminal Layer

| What | What It Does | Why You Have It |
|------|--------------|-----------------|
| **Ghostty** | Terminal app (renders text) | Fast, GPU-accelerated, starts tmux automatically |
| **Tmux** | Terminal multiplexer | Multiple panes/windows, sessions persist after close |
| **Tmux TPM** | Tmux plugin manager | Installs resurrect, continuum, cpu plugins |
| **Tmux Resurrect** | Save/restore sessions | Close laptop, reopen tmux, everything's back |
| **Tmux Continuum** | Auto-save sessions | Never lose your work |

### Editor Layer

| What | What It Does | Why You Have It |
|------|--------------|-----------------|
| **Neovim** | Terminal text editor | Like Vim but modern, plugins, LSP, etc. |
| **LazyVim** | Neovim config framework | Pre-configured plugins, no manual setup |
| **Zed** | GUI editor | Fast, native, vim mode |
| **Copilot** | AI code completion | Autocomplete powered by AI |

### CLI Tools

| What | What It Does | Replaces |
|------|--------------|----------|
| **eza** | Lists files with icons/colors | `ls` |
| **bat** | Cat with syntax highlighting | `cat` |
| **fd** | Fast file finder | `find` |
| **ripgrep** | Blazing fast text search | `grep` |
| **delta** | Better git diffs | `diff` |
| **lazygit** | Git TUI (terminal UI) | Complex git commands |
| **dust** | Visual disk usage | `du` |
| **duf** | Pretty disk space | `df` |
| **hyperfine** | Benchmark commands | `time` |
| **httpie** | Pretty HTTP client | `curl` |

### System Tools

| What | What It Does | Why You Have It |
|------|--------------|-----------------|
| **Fastfetch** | Shows system info on startup | Cool + useful (see RAM, CPU, uptime) |
| **Karabiner** | Remap keyboard keys | Hyper key (Caps→Ctrl+Opt+Shift+Cmd) |
| **OmniWM** | Tiling window manager | Auto-arranges windows, keyboard-driven |
| **Wakatime** | Time tracking | Tracks coding time automatically |
| **Gopass** | Password manager | CLI-based, Git-backed, encrypted |

### AI Tools

| What | What It Does | Why You Have It |
|------|--------------|-----------------|
| **OpenCode** | AI coding assistant | Like Cursor but terminal-based |
| **Antigravity Auth** | OpenCode ↔ Google OAuth | Access Gemini, Claude via Google |
| **Gemini CLI** | Google's AI in terminal | Alternative to ChatGPT |
| **Agents (.agents/)** | Design skill pack | 20 skills for UI/UX improvements |

## OpenCode

### What Is OpenCode?

OpenCode is a terminal-based AI coding assistant. Think Cursor, but it runs in your terminal. You can chat with it, ask it to write code, explain things, run commands, etc.

### Config Location

`~/.config/opencode/opencode.json`

### Antigravity Auth Plugin

[antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth) lets you use Google's premium AI models (Claude Opus, Gemini Pro) through Google OAuth. No API key needed — just sign in with your Google account.

**How to install:**

1. The plugin is already in your `opencode.json`:
   ```json
   { "plugin": ["opencode-antigravity-auth@latest"] }
   ```

2. Login with Google:
   ```bash
   opencode auth login
   ```

3. That's it. You now have access to:

**Antigravity models (Google quota):**

| Model | What It's Good For |
|-------|-------------------|
| `antigravity-claude-opus-4-6-thinking` | Hardest problems, complex reasoning |
| `antigravity-claude-sonnet-4-6` | General coding, fast |
| `antigravity-gemini-3.1-pro` | Large context, multimodal |
| `antigravity-gemini-3-pro` | General purpose |
| `antigravity-gemini-3-flash` | Fast, cheap, good enough |

**Gemini CLI models (separate quota):**

| Model | What It's Good For |
|-------|-------------------|
| `gemini-2.5-pro` | Solid general purpose |
| `gemini-2.5-flash` | Fast, cheaper |

**Using a model:**

```bash
# Run with a specific model
opencode run "explain this code" --model=google/antigravity-claude-sonnet-4-6

# Use thinking mode (Opus)
opencode run "solve this bug" --model=google/antigravity-claude-opus-4-6-thinking --variant=max

# Inside OpenCode TUI, just type:
/model google/antigravity-gemini-3.1-pro
```

**Multi-account setup:**

```bash
# Add more Google accounts for higher quotas
opencode auth login   # Run again to add another account
opencode auth login   # And again...
```

The plugin auto-rotates when one account gets rate-limited.

**Config file locations:**

| File | What's In It |
|------|-------------|
| `~/.config/opencode/opencode.json` | Main config, plugins, models |
| `~/.config/opencode/antigravity-accounts.json` | Your Google auth tokens (don't share!) |
| `~/.config/opencode/antigravity.json` | Optional plugin settings |

**Warning:** Using this may violate Google's Terms of Service. Some users have reported account restrictions. Use at your own risk.

### Common OpenCode Commands

```bash
# Start interactive mode
opencode

# Run a single prompt
opencode run "write a fibonacci function in python"

# Login/logout
opencode auth login
opencode auth logout
```

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

# Check if command exists
command_exists docker
# → returns 0 if exists, 1 if not

# Countdown to date
remaining_days 2026-08-13
# → Shows "47 days --> Saturday, August 13, 2026"
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

### What Is FZF?

FZF lets you fuzzy-find anything. Type partial names and it shows matches. Used everywhere in this setup.

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

### What Is Tmux?

Tmux = Terminal Multiplexer. Lets you:
- Split terminal into panes (like VS Code panels)
- Have multiple windows (like browser tabs)
- **Detach and reattach** (close laptop, reopen tmux, everything's still there)

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

## Neovim (LazyVim)

### What Is Neovim?

Neovim = Modern version of Vim. Terminal-based text editor with plugins, LSP (code intelligence), treesitter (better syntax).

### What Is LazyVim?

LazyVim = Pre-configured Neovim. Instead of spending days configuring, you get:
- Auto-completion
- Git integration
- File tree
- Fuzzy finder
- LSP (go-to-definition, hover docs, etc.)
- 100+ plugins managed by `lazy.nvim`

### First Time Setup

```bash
# Open nvim - it will auto-install plugins
nvim

# Wait for Lazy to sync plugins
# Press any key when done

# Open file tree
<Space> e

# Find files
<Space> ff

# Search in project
<Space> sg

# Find references
<Space> gr
```

### Key Mappings

| Key | Action |
|-----|--------|
| `Space` | Leader key (opens command palette) |
| `Space ff` | Find files |
| `Space fb` | Find buffers |
| `Space sg` | Search grep (in project) |
| `Space /` | Search in current file |
| `Space ee` | File explorer |
| `Space gd` | Go to definition |
| `Space gr` | Find references |
| `Space ca` | Code actions |
| `Space rr` | Rename symbol |
| `Space ff` | Format file |

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

### What Is Ghostty?

Ghostty = Terminal emulator (the app window that shows text). Yours is configured to:
- Use JetBrainsMono Nerd Font (13pt)
- Auto-start tmux session on launch

### Settings

**File:** `~/.config/ghostty/config`

```toml
font-family = "JetBrainsMono Nerd Font"
font-size = 13
command = /opt/homebrew/bin/tmux new-session -A -s main
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

## OmniWM (Window Manager)

### What Is OmniWM?

OmniWM = Tiling window manager for macOS. It automatically arranges windows and lets you control them with keyboard.

### Features

- **Smart split** - Auto-arranges windows in tiles
- **Focus follows mouse** - Click to focus
- **No gaps** - Windows fill screen
- **Command palette** - `Ctrl+Space` to open

### Config Location

`~/.config/omniwm/settings.json`

```json
{
  "smart_split": true,
  "focus_follows_mouse": true,
  "gaps": false,
  "command_palette_hotkey": "Ctrl+Space",
  "prevent_sleep": true
}
```

### Usage

```
Hyper + H/J/K/L    Move windows
Ctrl+Space         Command palette
```

---

## Fastfetch

Customizes the system info shown on shell startup.

**File:** `~/.config/fastfetch/config.jsonc`

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

### Neovim plugins not loading

```bash
# Open nvim, then:
:Lazy sync
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

### Fastfetch not showing

```bash
# Make sure it's installed
brew install fastfetch
```

---

**Need help?** Open an issue on [GitHub](https://github.com/Paranjayy/dotfiles/issues).
