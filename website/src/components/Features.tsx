"use client";

const platforms = [
  {
    name: "Hyprland",
    desc: "Wayland compositor with smooth animations, tiling, and Omarchy defaults",
    icon: "🏔️",
    color: "from-blue-500/20 to-purple-500/20",
    border: "border-blue-500/30",
    tag: "linux/hypr/",
  },
  {
    name: "Niri",
    desc: "Scrollable tiling Wayland compositor with column-based layouts",
    icon: "📜",
    color: "from-green-500/20 to-emerald-500/20",
    border: "border-green-500/30",
    tag: "linux/niri/",
  },
  {
    name: "KDE Plasma",
    desc: "Full desktop environment with custom theme, shortcuts, and kwinrc tweaks",
    icon: "⚙️",
    color: "from-cyan-500/20 to-blue-500/20",
    border: "border-cyan-500/30",
    tag: "linux/kde/",
  },
  {
    name: "macOS",
    desc: "Raycast, Karabiner, BetterTouchTool, shell aliases, and window management",
    icon: "🍎",
    color: "from-gray-500/20 to-gray-400/20",
    border: "border-gray-500/30",
    tag: "macOS/",
  },
  {
    name: "Windows",
    desc: "Cross-platform PowerShell with Oh My Posh, git aliases, package managers",
    icon: "🪟",
    color: "from-blue-600/20 to-cyan-500/20",
    border: "border-blue-600/30",
    tag: "windows/",
  },
  {
    name: "Arch Linux",
    desc: "One-shot setup script with core, display, dev, and tool packages",
    icon: "🔷",
    color: "from-blue-400/20 to-indigo-500/20",
    border: "border-blue-400/30",
    tag: "arch/setup.sh",
  },
];

const tools = [
  { name: "Alacritty", cat: "Terminal" },
  { name: "Kitty", cat: "Terminal" },
  { name: "Ghostty", cat: "Terminal" },
  { name: "Foot", cat: "Terminal" },
  { name: "Waybar", cat: "Status Bar" },
  { name: "Mako", cat: "Notifications" },
  { name: "Btop", cat: "System Monitor" },
  { name: "Fastfetch", cat: "System Info" },
  { name: "Tmux", cat: "Terminal Mux" },
  { name: "Lazygit", cat: "Git TUI" },
  { name: "GTK 3/4", cat: "Theming" },
  { name: "Fontconfig", cat: "Fonts" },
];

export function Features() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Platforms */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Every Platform
            </span>
          </h2>
          <p className="text-gray-400 text-lg">One configuration to rule them all</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32">
          {platforms.map((p) => (
            <div
              key={p.name}
              className={`group p-6 rounded-2xl bg-gradient-to-br ${p.color} border ${p.border} hover:scale-[1.02] transition-all duration-300`}
            >
              <div className="text-4xl mb-4">{p.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{p.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{p.desc}</p>
              <code className="text-xs px-2 py-1 rounded bg-black/30 text-gray-300 font-mono">
                {p.tag}
              </code>
            </div>
          ))}
        </div>

        {/* Tools */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
              Included Tools
            </span>
          </h2>
          <p className="text-gray-400 text-lg">Pre-configured and ready to use</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tools.map((t) => (
            <div
              key={t.name}
              className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="text-sm text-gray-500 mb-1">{t.cat}</div>
              <div className="font-medium">{t.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
