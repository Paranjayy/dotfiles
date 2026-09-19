# Dotfiles Maintainer Etiquette

Applies to human and AI maintainers. Goal: fast shell, reproducible setup,
nothing lost, nothing leaked.

## Source-of-truth map

| Live file | Tracked copy | Sync |
|---|---|---|
| `~/.zshrc` | `zsh/.zshrc` | `dots sync` (copies + commits + pushes) |
| `~/.config/tmux/tmux.conf` | `tmux/tmux.conf` | `dots sync` |
| `~/.config/fastfetch/*` | same (in repo) | edit in place |
| `~/.config/ghostty/config.minimal` + `config.glass` | same | edit these, never `config` directly (`config` is produced by the `glass` toggle) |
| `~/.zshrc.local`, `~/.zshrc.providers.zsh` | NEVER tracked | secrets + machine-specific go here only |

## Golden rules

1. **Secrets never enter the repo.** API keys, tokens, credentials → untracked
   local files above. Check `git diff --cached` for secrets before every commit.
2. **Stage only intended files.** This repo collects dirt from apps
   (`settings.json`, caches, lockfiles). `git add <paths>`, never `git add -A`.
3. **Keep shell startup under ~0.5s.** Verify with `time zsh -i -c exit`.
   No network calls, no plugin clones at startup. New plugins must be
   sourced from the local zinit cache with a readability guard
   (`[[ -r ... ]] && source ...`).
4. **Fastfetch `command` modules must finish in <100ms.** Anything slower
   (osascript, network, system_profiler) goes through the
   `gather_stats.sh`/`get_cached.sh` cache or gets a watchdog. Time suspect
   modules solo before committing (see Verification).
5. **Reload correctly.** `reload` (`source ~/.zshrc`) for aliases/functions.
   `exec zsh` or `daily` for widget/plugin/hook changes (re-sourcing can
   double-register). `lite`/`vanilla` for troubleshooting sessions.
6. **Don't fight the gates.** `ZSH_ENABLE_PLUGINS=1` = full zinit mode,
   `FAST_SHELL_EXTRAS=0` = bare mode. Direct-sourced extras must skip when
   `ZSH_PLUGINS_ENABLED` is set (no double-loading). Load order: compinit →
   fzf-tab → autosuggestions → syntax-highlighting (last).
7. **Ghostty theme discipline.** Default stays minimal. Glass experiments go
   in `config.glass`, toggled via `glass on|off|status`. Ghostty reloads live.

## Verification (run before commit)

```sh
zsh -n ~/.zshrc                                   # syntax
time zsh -i -c exit                               # startup budget
fastfetch --config ~/.config/fastfetch/config.jsonc --logo-type builtin          # stats
fastfetch --config ~/.config/fastfetch/config-private.jsonc --logo-type builtin  # stats-safe
```

## Commits

Conventional style: `feat|fix|chore|docs(scope): subject`. One concern per
commit. Always `git status` + `git diff` first, push after.
