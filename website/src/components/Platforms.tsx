"use client";

const platforms = [
  {
    name: "Hyprland",
    desc: "Wayland compositor with smooth animations, tiling, and Omarchy defaults",
    icon: "🏔️",
    gradient: "from-blue-500 to-purple-600",
    tag: "linux/hypr/",
    features: ["Animations", "Blur", "Workspaces", "Keybinds"],
  },
  {
    name: "Niri",
    desc: "Scrollable tiling Wayland compositor with column-based layouts",
    icon: "📜",
    gradient: "from-green-500 to-emerald-600",
    tag: "linux/niri/",
    features: ["Tiling", "Columns", "Gestures", "Scroll"],
  },
  {
    name: "KDE Plasma",
    desc: "Full desktop environment with custom theme and kwinrc tweaks",
    icon: "⚙️",
    gradient: "from-cyan-500 to-blue-600",
    tag: "linux/kde/",
    features: ["Widgets", "Shortcuts", "Theme", "KWin"],
  },
  {
    name: "macOS",
    desc: "Raycast, Karabiner, BetterTouchTool, shell aliases",
    icon: "🍎",
    gradient: "from-zinc-400 to-zinc-600",
    tag: "macos/",
    features: ["Raycast", "Karabiner", "BTT", "Shell"],
  },
  {
    name: "Windows",
    desc: "Cross-platform PowerShell with Oh My Posh and git aliases",
    icon: "🪟",
    gradient: "from-blue-600 to-cyan-500",
    tag: "windows/",
    features: ["PowerShell", "OhMyPosh", "Winget", "Scoop"],
  },
  {
    name: "Arch Linux",
    desc: "One-shot setup script with core, display, dev, and tool packages",
    icon: "🔷",
    gradient: "from-blue-400 to-indigo-600",
    tag: "arch/",
    features: ["Setup Script", "Yay", "Packages", "Services"],
  },
];

export function Platforms() {
  return (
    <section className="py-24 px-6 bg-zinc-900/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Every Platform
            </span>
          </h2>
          <p className="text-zinc-400 text-lg">One configuration to rule them all</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platforms.map((p, i) => (
            <div
              key={p.name}
              className={`group relative p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-600 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-${p.gradient.split('-')[1]}-500/10`}
            >
              {/* Gradient accent line */}
              <div className={`absolute top-0 left-6 right-6 h-px bg-gradient-to-r ${p.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="flex items-start justify-between mb-4">
                <span className="text-5xl">{p.icon}</span>
                <code className="text-xs px-2 py-1 rounded bg-zinc-800 text-zinc-400 font-mono border border-zinc-700">
                  {p.tag}
                </code>
              </div>
              
              <h3 className="text-xl font-bold mb-2 text-white">{p.name}</h3>
              <p className="text-zinc-400 text-sm mb-4 leading-relaxed">{p.desc}</p>
              
              <div className="flex flex-wrap gap-2">
                {p.features.map((f) => (
                  <span key={f} className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
