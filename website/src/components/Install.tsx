"use client";

import { useState } from "react";

const installMethods = [
  {
    os: "Arch Linux",
    icon: "🔷",
    commands: [
      "git clone https://github.com/Paranjayy/dotfiles.git ~/dotfiles",
      "cd ~/dotfiles",
      "chmod +x arch/setup.sh",
      "./arch/setup.sh",
    ],
  },
  {
    os: "Windows",
    icon: "🪟",
    commands: [
      "git clone https://github.com/Paranjayy/dotfiles.git $env:USERPROFILE\\dotfiles",
      "cd $env:USERPROFILE\\dotfiles",
      ".\\windows\\setup.ps1",
    ],
  },
  {
    os: "macOS",
    icon: "🍎",
    commands: [
      "git clone https://github.com/Paranjayy/dotfiles.git ~/dotfiles",
      "cd ~/dotfiles",
      "# Copy configs to ~/.config/",
      "cp -r raycast karabiner BetterTouchTool omniwm ~/",
    ],
  },
];

export function Install() {
  const [active, setActive] = useState(0);

  return (
    <section id="install" className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Quick Install
            </span>
          </h2>
          <p className="text-gray-400 text-lg">Get started in one command</p>
        </div>

        {/* OS Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          {installMethods.map((m, i) => (
            <button
              key={m.os}
              onClick={() => setActive(i)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                active === i
                  ? "bg-white text-black"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              <span className="mr-2">{m.icon}</span>
              {m.os}
            </button>
          ))}
        </div>

        {/* Code Block */}
        <div className="rounded-2xl bg-[#0d1117] border border-white/10 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  installMethods[active].commands.join("\n")
                );
              }}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Copy all
            </button>
          </div>

          <div className="p-6 space-y-3">
            {installMethods[active].commands.map((cmd, i) => (
              <div key={i} className="flex items-center gap-3 font-mono text-sm">
                <span className="text-green-500 select-none">$</span>
                <span className="text-gray-300">{cmd}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
