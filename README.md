# 🛠️ .config | Paranjay's System Environment

This repository tracks my core system configurations, environment variables, and tool preferences. It is designed for the **OmniWM "God Build"** ecosystem.

## 📂 Component Directory

### 🐚 Zsh (`zsh/`)
Modern shell with **Starship** integration.
-   **Config**: `~/.zshrc`
-   **Features**: Syntax highlighting, autosuggestions, fuzzy-tab completion.
-   **Aliases**:
    -   `reload`: Refresh your entire shell config.
    -   `proj`: Jump to `~/Developer` directory.
    -   `tms`: Quickly attach to main tmux session.
    -   `..`, `...`, `....`: Easy directory climbing.

### 🍱 Tmux (`tmux/`)
Session manager with a **Theo-inspired** (t3.gg) aesthetic.
-   **Config**: `~/.config/tmux/tmux.conf`
-   **Shortcuts** (Prefix is `Ctrl+B`):
    -   `|` and `-`: Split pane vertically / horizontally.
    -   `Shift + ←/→`: Switch windows (No prefix needed).
    -   `Alt + Arrow Keys`: Switch panes (No prefix needed).
    -   `z`: Toggle pane fullscreen.
    -   `g`: Pop up **LazyGit** (80% screen).
    -   `t`: Pop up **System Stats** (htop/btm).
    -   `r`: Reload tmux config.
    -   `e`: Jump into config editing.

### 👻 Ghostty (`ghostty/`)
High-performance macOS terminal.
-   **Default**: Out-of-the-box standard look.
-   **Glass Mode**: Run `ghostty --config-file=~/.config/ghostty/glass` for blurred transparency.

### 🎹 Keyboard & WM (`karabiner/`, `omniwm/`)
The layers of the God Build. 
-   **OmniWM**: Managed window tiling (Niri layout).
-   **Karabiner**: Layer triggers for OmniWM commands.
-   *Note: Deep-config pending (User Exam Mode Active).*

## 🔄 Syncing
To save your sweating/changes to this repo:
```bash
git -C ~/.config status
git -C ~/.config add .
git -C ~/.config commit -m "feat: your update message"
```

---
*Maintained by Paranjay & Antigravity Assistant*
