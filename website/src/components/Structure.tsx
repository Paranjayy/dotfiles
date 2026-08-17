"use client";

const treeData = [
  { name: "arch/", desc: "Arch install script", indent: 0 },
  { name: "install.sh", desc: "One-shot setup", indent: 1, isFile: true },
  { name: "linux/", desc: "", indent: 0 },
  { name: "hypr/", desc: "Hyprland (Omarchy)", indent: 1 },
  { name: "autostart.conf", desc: "Startup apps", indent: 2, isFile: true },
  { name: "bindings.conf", desc: "Keybindings", indent: 2, isFile: true },
  { name: "input.conf", desc: "Input settings", indent: 2, isFile: true },
  { name: "looknfeel.conf", desc: "Appearance", indent: 2, isFile: true },
  { name: "monitors.conf", desc: "Monitor setup", indent: 2, isFile: true },
  { name: "niri/", desc: "Niri compositor", indent: 1 },
  { name: "config.kdl", desc: "Niri config", indent: 2, isFile: true },
  { name: "kde/", desc: "KDE/Plasma", indent: 1 },
  { name: "kdeglobals", desc: "Global settings", indent: 2, isFile: true },
  { name: "kwinrc", desc: "Window manager", indent: 2, isFile: true },
  { name: "waybar/", desc: "Status bar", indent: 1 },
  { name: "config.jsonc", desc: "Bar config", indent: 2, isFile: true },
  { name: "style.css", desc: "Bar styles", indent: 2, isFile: true },
  { name: "alacritty/", desc: "Terminal", indent: 1 },
  { name: "kitty/", desc: "Terminal", indent: 1 },
  { name: "ghostty/", desc: "Terminal", indent: 1 },
  { name: "foot/", desc: "Wayland terminal", indent: 1 },
  { name: "gtk/", desc: "GTK3 + GTK4 themes", indent: 1 },
  { name: "btop/", desc: "System monitor", indent: 1 },
  { name: "mako/", desc: "Notifications", indent: 1 },
  { name: "tmux/", desc: "Terminal multiplexer", indent: 1 },
  { name: "lazygit/", desc: "Git TUI", indent: 1 },
  { name: "fastfetch/", desc: "System info", indent: 1 },
  { name: "git/", desc: "Git config", indent: 1 },
  { name: "windows/", desc: "", indent: 0 },
  { name: "install.ps1", desc: "PowerShell installer", indent: 1, isFile: true },
  { name: "Microsoft.PowerShell_profile.ps1", desc: "Profile", indent: 1, isFile: true },
  { name: "macos/", desc: "", indent: 0 },
  { name: "raycast/", desc: "Launcher", indent: 1 },
  { name: "karabiner/", desc: "Key remapping", indent: 1 },
  { name: "BetterTouchTool/", desc: "Gestures", indent: 1 },
  { name: "omniwm/", desc: "Window manager", indent: 1 },
  { name: "shell/", desc: "Aliases", indent: 1 },
  { name: "zsh/", desc: "Shell config", indent: 1 },
];

export function Structure() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Repository Structure
            </span>
          </h2>
          <p className="text-zinc-400 text-lg">Organized by platform and tool</p>
        </div>

        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-2xl">
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-zinc-800/50 border-b border-zinc-700">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="ml-2 text-sm text-zinc-500 font-mono">~/dotfiles</span>
          </div>

          {/* Tree */}
          <div className="p-6 font-mono text-sm overflow-x-auto">
            <div className="text-zinc-500 mb-2">dotfiles/</div>
            {treeData.map((item, i) => {
              const prefix = item.indent > 0 ? "│  ".repeat(Math.max(0, item.indent - 1)) + "├── " : "";
              return (
                <div key={i} className="flex items-center gap-2 py-0.5 hover:bg-zinc-800/50 rounded px-1">
                  <span className="text-zinc-600 whitespace-pre">{prefix}</span>
                  <span className={`${item.isFile ? 'text-zinc-400' : 'text-purple-400 font-medium'}`}>
                    {item.name}
                  </span>
                  {item.desc && (
                    <span className="text-zinc-600 ml-auto"># {item.desc}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
