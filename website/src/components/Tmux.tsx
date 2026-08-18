"use client";

const tmuxFeatures = [
  { key: "Ctrl+Space", desc: "Prefix key (replaces Ctrl+B)" },
  { key: "Alt+Enter", desc: "Split horizontal" },
  { key: "Alt+Shift+Enter", desc: "Split vertical" },
  { key: "Alt+Escape", desc: "Kill pane" },
  { key: "Ctrl+Alt+Arrow", desc: "Switch panes" },
  { key: "Ctrl+Alt+Shift+Arrow", desc: "Resize panes" },
  { key: "Alt+1-9", desc: "Switch to window 1-9" },
  { key: "Alt+Left/Right", desc: "Switch windows" },
  { key: "Alt+Shift+Left/Right", desc: "Swap windows" },
  { key: "Alt+Up/Down", desc: "Switch sessions" },
  { key: "v / y", desc: "Vi copy mode (select / yank)" },
  { key: "q", desc: "Reload config" },
];

const tmuxExtras = [
  "256color + RGB support",
  "Mouse enabled",
  "Vi copy mode",
  "Smart pane navigation (vim-aware)",
  "Session auto-rename by directory",
  "Extended keys (CSI-u for tmux inside terminals)",
  "Clipboard passthrough",
  "Powerline-style status bar",
];

export function Tmux() {
  return (
    <section className="py-24 px-6 bg-zinc-900/30" id="tmux">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Tmux</span>
          </h2>
          <p className="text-zinc-400 text-lg">Terminal multiplexer with Vi mode, smart splits, and powerline status</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Keybindings */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-zinc-200">Keybindings</h3>
            <div className="space-y-2">
              {tmuxFeatures.map((f) => (
                <div key={f.key} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                  <span className="text-zinc-400 text-sm">{f.desc}</span>
                  <kbd className="px-2.5 py-1 rounded bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 font-mono">{f.key}</kbd>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-zinc-200">Features</h3>
            <div className="space-y-3">
              {tmuxExtras.map((f) => (
                <div key={f} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                  <span className="text-green-400">✓</span>
                  <span className="text-zinc-300 text-sm">{f}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/50">
              <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Status Bar</div>
              <div className="font-mono text-sm text-zinc-300 space-y-1">
                <div><span className="text-blue-400">session-name</span> <span className="text-zinc-500">│</span> <span className="text-zinc-400">1:zsh</span> <span className="text-blue-400">2:btop</span> <span className="text-zinc-400">3:nvim</span></div>
                <div className="text-zinc-600 text-xs">PREFIX │ COPY │ ZOOM indicators</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
