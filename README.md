# dotfiles

My complete system configuration across Arch Linux, Hyprland, Niri, KDE, macOS, and Windows.

## Quick Install

**Arch Linux:**
```bash
curl -fsSL https://raw.githubusercontent.com/Paranjayy/dotfiles/main/arch/install.sh | bash
```

**Windows (run as Admin):**
```powershell
irm https://raw.githubusercontent.com/Paranjayy/dotfiles/main/windows/install.ps1 | iex
```

**macOS:**
```bash
curl -fsSL https://raw.githubusercontent.com/Paranjayy/dotfiles/main/macos/install.sh | bash
```

## What's Inside

### Linux
| Path | What |
|------|------|
| `linux/hypr/` | Hyprland config (Omarchy-based) |
| `linux/niri/` | Niri compositor |
| `linux/kde/` | KDE/Plasma settings |
| `linux/waybar/` | Status bar |
| `linux/alacritty/` | Alacritty terminal |
| `linux/kitty/` | Kitty terminal |
| `linux/ghostty/` | Ghostty terminal |
| `linux/foot/` | Foot terminal |
| `linux/gtk/` | GTK3 + GTK4 themes |
| `linux/btop/` | System monitor |
| `linux/mako/` | Notifications |
| `linux/tmux/` | Terminal multiplexer |
| `linux/lazygit/` | Git TUI |
| `linux/fastfetch/` | System info |

### macOS
| Path | What |
|------|------|
| `raycast/` | Launcher config |
| `karabiner/` | Key remapping |
| `BetterTouchTool/` | Gestures & automation |
| `omniwm/` | Window manager |
| `shell/` | Aliases & functions |
| `zsh/` | Zsh config |

### Windows
| Path | What |
|------|------|
| `windows/setup.ps1` | PowerShell profile |
| `windows/install.ps1` | One-shot installer |

### Dev
| Path | What |
|------|------|
| `arch/setup.sh` | Arch install script |
| `git/` | Git config |
| `website/` | Showcase site (Next.js) |

## Website

Live: [dotfiles.vercel.app](https://website-two-iota-zukp3rlpu8.vercel.app)

## License

MIT
