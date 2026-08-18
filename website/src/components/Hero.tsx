"use client";
import { useEffect, useState } from "react";

export function Hero() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 1px 1px, rgba(168,85,247,0.3) 1px, transparent 0)', backgroundSize:'40px 40px'}} />
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[120px]" />

      <div className={`relative z-10 text-center px-6 max-w-5xl mx-auto transition-all duration-1000 ${m ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/50 text-sm text-zinc-400 mb-8">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Hyprland · Niri · KDE · macOS · Windows
        </div>

        <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-6 leading-none">
          <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">dotfiles</span>
        </h1>

        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-4">
          My complete system config. <span className="text-purple-400 font-semibold">4 platforms</span>, one repo.
        </p>
        <p className="text-base text-zinc-500 max-w-xl mx-auto mb-12">
          Hyprland with animations + blur, Niri scroll-tiling, KDE Plasma, macOS with Raycast + Karabiner, Windows with Oh My Posh.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a href="https://github.com/Paranjayy/dotfiles" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-all hover:scale-105">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            View on GitHub
          </a>
          <a href="#install" className="px-8 py-4 border border-zinc-700 rounded-xl text-zinc-300 hover:bg-zinc-800 transition-all">
            Quick Install
          </a>
        </div>

        <div className="flex items-center justify-center gap-8 text-sm text-zinc-500">
          <div className="flex flex-col items-center"><span className="text-2xl font-bold text-white">4</span><span>Platforms</span></div>
          <div className="w-px h-8 bg-zinc-800" />
          <div className="flex flex-col items-center"><span className="text-2xl font-bold text-white">30+</span><span>Keybindings</span></div>
          <div className="w-px h-8 bg-zinc-800" />
          <div className="flex flex-col items-center"><span className="text-2xl font-bold text-white">4</span><span>Terminals</span></div>
          <div className="w-px h-8 bg-zinc-800" />
          <div className="flex flex-col items-center"><span className="text-2xl font-bold text-white">1</span><span>Command</span></div>
        </div>
      </div>
    </section>
  );
}
