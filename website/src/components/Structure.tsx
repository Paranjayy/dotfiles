"use client";

const tree = `dotfiles/
├── arch/
│   └── setup.sh                 # Arch install script
├── linux/
│   ├── alacritty/               # Alacritty config
│   ├── btop/                    # System monitor
│   ├── environment.d/           # systemd env vars
│   ├── fastfetch/               # System info
│   ├── fontconfig/              # Font rendering
│   ├── foot/                    # Wayland terminal
│   ├── ghostty/                 # Ghostty terminal
│   ├── git/                     # Git config
│   ├── gtk/                     # GTK3 + GTK4 themes
│   ├── hypr/                    # Hyprland (Omarchy)
│   │   ├── autostart.conf
│   │   ├── bindings.conf
│   │   ├── input.conf
│   │   ├── looknfeel.conf
│   │   └── monitors.conf
│   ├── kde/                     # KDE/Plasma
│   │   ├── kdeglobals
│   │   ├── kwinrc
│   │   └── ...
│   ├── kitty/                   # Kitty terminal
│   ├── lazygit/                 # Lazygit
│   ├── mako/                    # Notifications
│   ├── niri/                    # Niri compositor
│   ├── tmux/                    # Tmux
│   └── waybar/                  # Status bar
├── windows/
│   ├── setup.ps1                # Windows install script
│   └── Microsoft.PowerShell_profile.ps1
├── BetterTouchTool/             # macOS gestures
├── karabiner/                   # macOS key remapping
├── omniwm/                      # macOS window manager
├── raycast/                     # macOS launcher
├── shell/                       # Cross-platform aliases
└── zsh/                         # Zsh config`;

export function Structure() {
  return (
    <section className="py-32 px-6 bg-white/[0.02]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Repository Structure
            </span>
          </h2>
          <p className="text-gray-400 text-lg">Organized by platform and tool</p>
        </div>

        <div className="rounded-2xl bg-[#0d1117] border border-white/10 overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-2 text-sm text-gray-500 font-mono">~/dotfiles</span>
          </div>

          {/* Tree */}
          <pre className="p-6 text-sm text-gray-300 font-mono overflow-x-auto leading-relaxed">
            {tree}
          </pre>
        </div>
      </div>
    </section>
  );
}
