"use client";

const terminals = [
  {
    name: "Kitty",
    desc: "GPU-accelerated terminal with image support",
    features: ["JetBrainsMono Nerd Font", "14px padding", "No decorations", "Remote control", "Powerline tabs", "Block cursor", "No bell"],
    keybindings: ["Ctrl+Insert → Copy", "Shift+Insert → Paste", "Shift+Enter → CSI-u (tmux)", "Alt+Shift+Enter → CSI-u"],
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Alacritty",
    desc: "GPU-accelerated, cross-platform terminal emulator",
    features: ["JetBrainsMono Nerd Font", "14px padding", "No decorations", "OSC52 clipboard", "256 color", "Dynamic theme from Omarchy"],
    keybindings: ["Ctrl+Insert → Copy", "Shift+Insert → Paste", "Shift+Enter → CSI-u", "Alt+Shift+Enter → CSI-u"],
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "Ghostty",
    desc: "Fast, feature-rich terminal from Mitchell Hashimoto",
    features: ["JetBrainsMono Nerd Font", "14px padding", "Block cursor", "epoll backend (Hyprland fix)", "SSH env integration", "Slow mouse scroll"],
    keybindings: ["Ctrl+Insert → Copy", "Shift+Insert → Paste", "Super+Ctrl+Shift+Alt+Arrow → Resize splits"],
    color: "from-cyan-500 to-blue-500",
  },
  {
    name: "Foot",
    desc: "Minimal, fast Wayland-native terminal",
    features: ["JetBrainsMono Nerd Font", "14px padding", "10000 lines scrollback", "Block cursor", "No blink", "0 workers (auto)"],
    keybindings: ["Ctrl+Insert → Copy", "Shift+Insert → Paste", "Shift+Enter → CSI-u", "Alt+Shift+Enter → CSI-u"],
    color: "from-orange-500 to-yellow-500",
  },
];

export function Terminals() {
  return (
    <section className="py-24 px-6 bg-zinc-900/30" id="terminals">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">Terminals</span>
          </h2>
          <p className="text-zinc-400 text-lg">4 terminals, all with matching fonts + padding + theme</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {terminals.map((t) => (
            <div key={t.name} className="rounded-2xl bg-zinc-900/80 border border-zinc-800 overflow-hidden hover:border-zinc-600 transition-all">
              <div className={`h-1 bg-gradient-to-r ${t.color}`} />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">{t.name}</h3>
                <p className="text-zinc-500 text-sm mb-4">{t.desc}</p>

                <div className="mb-4">
                  <div className="text-xs text-zinc-600 uppercase tracking-wider mb-2">Features</div>
                  <div className="flex flex-wrap gap-2">
                    {t.features.map((f) => (
                      <span key={f} className="text-xs px-2 py-1 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/50">{f}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-zinc-600 uppercase tracking-wider mb-2">Keybindings</div>
                  <div className="space-y-1">
                    {t.keybindings.map((kb) => (
                      <div key={kb} className="text-xs text-zinc-400 font-mono">{kb}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
