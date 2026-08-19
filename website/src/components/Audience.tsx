"use client";

import { useState } from "react";

const normieContent = {
  title: "For Everyone",
  subtitle: "Just want your computer to look cool and work well?",
  items: [
    {
      icon: "🎨",
      title: "Beautiful Themes",
      desc: "Dark mode everywhere, custom fonts, matching color schemes across all apps.",
    },
    {
      icon: "⌨️",
      title: "Better Shortcuts",
      desc: "Window snapping, app launcher, terminal shortcuts that just make sense.",
    },
    {
      icon: "🚀",
      title: "One-Click Setup",
      desc: "Copy one command, paste it in your terminal, and everything installs automatically.",
    },
    {
      icon: "📱",
      title: "Works Everywhere",
      desc: "Same vibe on your Mac, Windows PC, or Linux machine. Consistent experience.",
    },
  ],
};

const devContent = {
  title: "For Developers",
  subtitle: "Power-user configs for maximum productivity.",
  items: [
    {
      icon: "⚡",
      title: "Hyprland + Waybar",
      desc: "Wayland compositor with smooth animations, dynamic workspaces, and custom status bar.",
    },
    {
      icon: "🔲",
      title: "Niri Tiling",
      desc: "Scrollable tiling compositor with column-based layouts. Never touch a mouse.",
    },
    {
      icon: "🧩",
      title: "KDE Plasma",
      desc: "Full desktop with custom kwinrc, shortcuts, splash screen, and widget configs.",
    },
    {
      icon: "🛠️",
      title: "Dev Stack",
      desc: "Neovim, tmux, lazygit, fzf, bat, eza, starship prompt. Pre-configured.",
    },
    {
      icon: "📦",
      title: "Package Managers",
      desc: "yay (AUR), brew, winget, scoop. One installer per platform handles everything.",
    },
    {
      icon: "🔧",
      title: "Dotfile Sync",
      desc: "Git-tracked configs. Clone, run installer, done. Cross-platform PowerShell too.",
    },
  ],
};

export function Audience() {
  const [mode, setMode] = useState<"normie" | "dev">("normie");
  const content = mode === "normie" ? normieContent : devContent;

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              What's Inside
            </span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Whether you're new to ricing or a seasoned Arch user, there's something here for you.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 bg-zinc-800/50 rounded-xl border border-zinc-700">
            <button
              onClick={() => setMode("normie")}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                mode === "normie"
                  ? "bg-white text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              🌟 For Everyone
            </button>
            <button
              onClick={() => setMode("dev")}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                mode === "dev"
                  ? "bg-white text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              ⚡ For Developers
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mb-8 text-center">
          <h3 className="text-2xl font-semibold mb-2">{content.title}</h3>
          <p className="text-zinc-400">{content.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.items.map((item, i) => (
            <div
              key={`${mode}-${i}`}
              className="group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h4 className="text-lg font-semibold mb-2 text-white">{item.title}</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
