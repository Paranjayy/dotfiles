"use client";

const tools = [
  { name: "Waybar", desc: "Status bar with workspaces, clock, weather, CPU, battery, bluetooth, network, audio", icon: "📊", category: "UI" },
  { name: "Mako", desc: "Notification daemon with custom colors matching the theme", icon: "🔔", category: "UI" },
  { name: "Btop", desc: "System monitor — CPU, memory, disks, network, processes", icon: "📈", category: "Tools" },
  { name: "Fastfetch", desc: "System info display with custom config", icon: "💻", category: "Tools" },
  { name: "Lazygit", desc: "Terminal UI for git — stage, commit, diff, branches, rebasing", icon: "🔀", category: "Dev" },
  { name: "Lazydocker", desc: "Terminal UI for docker — containers, images, compose", icon: "🐳", category: "Dev" },
  { name: "Neovim", desc: "Modal editor with custom config", icon: "📝", category: "Dev" },
  { name: "Starship", desc: "Cross-shell prompt with git status, language versions", icon: "🚀", category: "Shell" },
  { name: "Zoxide", desc: "Smarter cd — jump to directories by frecency", icon: "📂", category: "Shell" },
  { name: "FZF", desc: "Fuzzy finder for files, history, processes", icon: "🔍", category: "Shell" },
  { name: "Ripgrep", desc: "Blazing fast grep for code search", icon: "⚡", category: "Dev" },
  { name: "Bat", desc: "Cat with syntax highlighting and line numbers", icon: "🦇", category: "Tools" },
  { name: "Eza", desc: "Modern ls with colors, icons, git status", icon: "📁", category: "Tools" },
  { name: "fd", desc: "Fast, user-friendly find alternative", icon: "🔎", category: "Dev" },
  { name: "GTK3/4", desc: "Custom theme with matching colors across all GTK apps", icon: "🎨", category: "UI" },
  { name: "Fontconfig", desc: "Font rendering and alias configuration", icon: "🔤", category: "UI" },
];

export function DevTools() {
  return (
    <section className="py-24 px-6" id="tools">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">Dev Stack</span>
          </h2>
          <p className="text-zinc-400 text-lg">Pre-configured tools that just work</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tools.map((t) => (
            <div key={t.name} className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-600 transition-all group">
              <div className="text-2xl mb-2">{t.icon}</div>
              <div className="text-xs text-zinc-600 uppercase tracking-wider mb-1">{t.category}</div>
              <div className="font-semibold text-sm mb-1">{t.name}</div>
              <div className="text-xs text-zinc-500 leading-relaxed">{t.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
