"use client";
import { useState } from "react";

const categories = [
  {
    name: "Window Management",
    icon: "🪟",
    bindings: [
      { key: "Super + Enter", desc: "Open terminal" },
      { key: "Super + Alt + Enter", desc: "Open terminal with tmux" },
      { key: "Super + Shift + F", desc: "File manager" },
      { key: "Super + Alt + Shift + F", desc: "File manager (current dir)" },
      { key: "Super + Q", desc: "Kill window" },
      { key: "Super + Shift + E", desc: "Exit Hyprland" },
    ],
  },
  {
    name: "Apps",
    icon: "🚀",
    bindings: [
      { key: "Super + Shift + B", desc: "Browser" },
      { key: "Super + Shift + Alt + B", desc: "Browser (private)" },
      { key: "Super + Shift + N", desc: "Editor" },
      { key: "Super + Shift + M", desc: "Spotify" },
      { key: "Super + Shift + D", desc: "Docker (lazydocker)" },
      { key: "Super + Shift + O", desc: "Obsidian" },
      { key: "Super + Shift + W", desc: "Typora" },
      { key: "Super + Shift + SLASH", desc: "1Password" },
    ],
  },
  {
    name: "Web Apps",
    icon: "🌐",
    bindings: [
      { key: "Super + Shift + A", desc: "ChatGPT" },
      { key: "Super + Shift + Alt + A", desc: "Grok" },
      { key: "Super + Shift + E", desc: "Email (Hey)" },
      { key: "Super + Shift + C", desc: "Calendar (Hey)" },
      { key: "Super + Shift + Y", desc: "YouTube" },
      { key: "Super + Shift + X", desc: "X / Twitter" },
      { key: "Super + Shift + Alt + G", desc: "WhatsApp" },
      { key: "Super + Shift + P", desc: "Google Photos" },
    ],
  },
  {
    name: "System",
    icon: "⚡",
    bindings: [
      { key: "Super + Alt + Space", desc: "Omarchy menu" },
      { key: "Scroll Lock", desc: "Toggle RGB backlight" },
      { key: "Super + Shift + S", desc: "Screenshot" },
      { key: "Super + H", desc: "Dictation (VoxType)" },
    ],
  },
];

export function Keybindings() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-24 px-6" id="keybindings">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Keybindings</span>
          </h2>
          <p className="text-zinc-400 text-lg">Every shortcut at your fingertips</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((c, i) => (
            <button key={c.name} onClick={() => setActive(i)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${active === i ? "bg-white text-black" : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-700/50"}`}>
              {c.icon} {c.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories[active].bindings.map((b) => (
            <div key={b.key} className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-600 transition-all">
              <span className="text-zinc-300">{b.desc}</span>
              <kbd className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-zinc-300 font-mono whitespace-nowrap">{b.key}</kbd>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
