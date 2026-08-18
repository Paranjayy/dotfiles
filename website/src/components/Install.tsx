"use client";
import { useState } from "react";

const methods = [
  {
    os: "Arch Linux",
    icon: "🔷",
    steps: [
      { cmd: "curl -fsSL https://raw.githubusercontent.com/Paranjayy/dotfiles/main/arch/install.sh | bash", desc: "One command — installs everything" },
    ],
    what: "yay, Hyprland, Niri, KDE, 4 terminals, waybar, btop, fastfetch, neovim, tmux, fzf, bat, eza, starship, zoxide, lazygit, fonts, and copies all configs.",
  },
  {
    os: "Windows",
    icon: "🪟",
    steps: [
      { cmd: "irm https://raw.githubusercontent.com/Paranjayy/dotfiles/main/windows/install.ps1 | iex", desc: "Run as Administrator" },
    ],
    what: "winget packages (terminal, dev tools, runtimes), scoop extras, Oh My Posh, PowerShell profile, git config, dark mode.",
  },
  {
    os: "macOS",
    icon: "🍎",
    steps: [
      { cmd: "curl -fsSL https://raw.githubusercontent.com/Paranjayy/dotfiles/main/macos/install.sh | bash", desc: "One command" },
    ],
    what: "Homebrew + casks (Alacritty, Ghostty, Obsidian, Firefox, Spotify, Raycast, Karabiner), neovim, tmux, fzf, starship, zoxide.",
  },
];

export function Install() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-24 px-6" id="install">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Quick Install</span>
          </h2>
          <p className="text-zinc-400 text-lg">Copy one command, paste in terminal, done</p>
        </div>

        <div className="flex justify-center gap-3 mb-8">
          {methods.map((m, i) => (
            <button key={m.os} onClick={() => setActive(i)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${active === i ? "bg-white text-black" : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 border border-zinc-700/50"}`}>
              {m.icon} {m.os}
            </button>
          ))}
        </div>

        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-zinc-800/50 border-b border-zinc-700">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <button onClick={() => navigator.clipboard.writeText(methods[active].steps[0].cmd)}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Copy</button>
          </div>

          <div className="p-6">
            {methods[active].steps.map((s, i) => (
              <div key={i} className="mb-4">
                <div className="flex items-center gap-2 font-mono text-sm mb-1">
                  <span className="text-green-500">$</span>
                  <span className="text-zinc-300 break-all">{s.cmd}</span>
                </div>
                <div className="text-xs text-zinc-500 ml-6">{s.desc}</div>
              </div>
            ))}

            <div className="mt-6 p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/50">
              <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">What gets installed</div>
              <p className="text-sm text-zinc-400 leading-relaxed">{methods[active].what}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
