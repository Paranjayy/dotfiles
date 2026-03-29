# Neovim (LazyVim)

Neovim configuration powered by [LazyVim](https://www.lazyvim.org/) — a pre-configured Neovim setup with sensible defaults and a plugin manager (lazy.nvim).

## What Is LazyVim?

LazyVim is a Neovim distribution that comes with:

- **Sensible defaults** — no need to configure everything from scratch
- **Plugin manager** — [lazy.nvim](https://github.com/folke/lazy.nvim) handles installs, updates, and lazy-loading
- **Extras system** — toggle features like LSP, linters, formatters with a single import
- **Keybindings** — `Space` is leader, `?` shows all keymaps

## File Structure

```
~/.config/nvim/
├── init.lua                    # Entry point, loads config
├── lazy-lock.json              # Plugin version lockfile (auto-generated)
└── lua/
    └── config/
        └── lazy.lua            # Bootstrap lazy.nvim, load plugins
    └── plugins/
        ├── extras.lua          # LazyVim extras (LSP, formatters, etc.)
        └── plugins.lua         # Custom plugin configs
```

## Key Mappings

### General

| Key | Action |
|-----|--------|
| `<Space>` | Leader key |
| `<Space>?` | Show all keymaps |
| `<Esc>` | Clear search highlight |
| `jj` | Escape insert mode (mapped in zshrc too) |

### Files

| Key | Action |
|-----|--------|
| `<Space>ff` | Find files |
| `<Space>fg` | Live grep |
| `<Space>fb` | Find buffers |
| `<Space>fr` | Recent files |
| `<Space>fd` | Find document symbols |

### Buffers

| Key | Action |
|-----|--------|
| `<Space>bb` | Switch buffer |
| `<Space>bd` | Delete buffer |
| `<Space>bp` | Previous buffer |
| `<Space>bn` | Next buffer |

### Git

| Key | Action |
|-----|--------|
| `<Space>gg` | Lazygit |
| `<Space>gb` | Git blame line |
| `<Space>gf` | Git file history |
| `<Space>gj` | Next hunk |
| `<Space>gk` | Previous hunk |
| `<Space>gp` | Preview hunk |

### Splits & Windows

| Key | Action |
|-----|--------|
| `<Space>sh` | Horizontal split |
| `<Space>sv` | Vertical split |
| `<Space>se` | Equal splits |
| `<Space>sx` | Close split |

### Tabs

| Key | Action |
|-----|--------|
| `<Space>tt` | New tab |
| `<Space>tn` | Next tab |
| `<Space>tp` | Previous tab |
| `<Space>tx` | Close tab |

### Code

| Key | Action |
|-----|--------|
| `<Space>ca` | Code actions |
| `<Space>cr` | Rename symbol |
| `<Space>cf` | Format code |
| `<Space>cd` | Line diagnostics |

### UI

| Key | Action |
|-----|--------|
| `<Space>uL` | Toggle line numbers |
| `<Space>us` | Toggle spelling |
| `<Space>uw` | Toggle word wrap |
| `<Space>ud` | Toggle diagnostics |

## Installed Extras

Extras are toggleable feature sets. Edit `lua/plugins/extras.lua` to enable/disable.

| Extra | What It Does |
|-------|--------------|
| `lang.typescript` | TypeScript/JavaScript LSP and tools |
| `lang.json` | JSON LSP with schema support |
| `lang.python` | Python LSP (pyright) and tools |
| `editor.mini-files` | File explorer (netrw replacement) |
| `formatting.prettier` | Prettier formatter for JS/TS/CSS/HTML |
| `linting.eslint` | ESLint linter for JS/TS |

> Note: LazyVim now uses `snacks_picker` and `snacks_dashboard` by default. The old `telescope` and `mini-starter` extras are no longer needed.

## Custom Plugins

### Catppuccin Theme

Mocha flavor — the default colorscheme.

### GitHub Copilot

AI code completion. Enable with `:Copilot setup`.

### Which-Key

Shows available keybindings when you press `<Space>`.

## Common Commands

| Command | Action |
|---------|--------|
| `:Lazy` | Open plugin manager |
| `:LazyHealth` | Check plugin health |
| `:Mason` | Open LSP installer |
| `:LazyExtras` | Browse available extras |
| `:Copilot setup` | Setup GitHub Copilot |
| `:Telescope` | Open picker (now Snacks) |

## Updating Plugins

```bash
# Inside Neovim
:Lazy update

# Or from terminal
nvim --headless "+Lazy! update" +qa
```

## Adding a New Plugin

Add to `lua/plugins/plugins.lua`:

```lua
return {
  {
    "author/plugin-name",
    event = "VeryLazy",  -- when to load
    opts = {},            -- plugin config
  },
}
```

## Troubleshooting

### Plugin errors

```bash
:Lazy log          # Check recent plugin changes
:Lazy restore      # Restore to lockfile versions
```

### LSP not working

```bash
:Mason             # Check LSP servers are installed
:LspInfo           # Check LSP status
```

### Clean slate

```bash
rm -rf ~/.local/share/nvim
rm -rf ~/.local/state/nvim
nvim               # Reinstall everything from scratch
```

---

**Docs:** [lazyvim.org](https://www.lazyvim.org/)
**Repo:** [github.com/LazyVim/LazyVim](https://github.com/LazyVim/LazyVim)
