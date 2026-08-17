"use client";

import { useEffect, useState } from "react";

export function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background grid */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(168,85,247,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '2s' }} />

      <div className={`relative z-10 text-center px-6 max-w-5xl mx-auto ${mounted ? 'animate-slide-up' : 'opacity-0'}`}>
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700 bg-zinc-800/50 text-sm text-zinc-400 mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Arch Linux · Hyprland · Niri · KDE · macOS · Windows
        </div>

        {/* Title */}
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-6 leading-none">
          <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
            dotfiles
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-6 leading-relaxed">
          My complete system configuration across{" "}
          <span className="text-purple-400 font-semibold">6 platforms</span>.
          One repo. Every machine.
        </p>

        <p className="text-base text-zinc-500 max-w-xl mx-auto mb-12">
          Hyprland with smooth animations, Niri tiling, KDE Plasma, macOS with Raycast + Karabiner, 
          and Windows with Oh My Posh. Pre-configured and ready to go.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://github.com/Paranjayy/dotfiles"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/10"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            View on GitHub
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
          <a
            href="#install"
            className="px-8 py-4 border border-zinc-700 rounded-xl text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600 transition-all duration-300"
          >
            Quick Install
          </a>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 mt-16 text-sm text-zinc-500">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white">6</span>
            <span>Platforms</span>
          </div>
          <div className="w-px h-8 bg-zinc-800" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white">30+</span>
            <span>Tools Configured</span>
          </div>
          <div className="w-px h-8 bg-zinc-800" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white">1</span>
            <span>Command Install</span>
          </div>
        </div>
      </div>
    </section>
  );
}
