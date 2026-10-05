# Keyboard and OmniWM etiquette

Updated October 2, 2026, after the user reported Cmd+V/Z working again.
Read this before keyboard changes, config restores, branch switches, migrations,
or bootstrap changes that could affect the running Mac.

## Intended setup

| Component | Intended behavior |
|---|---|
| Raycast | Owns Caps Lock Hyper. Quick Press = Does Nothing. Include Shift = on. Secure Input Compatibility = off. |
| OmniWM | `general.systemHyperTrigger = "None"`. Consumes Hyper shortcuts without remapping Caps Lock itself. |
| OmniWM Hyper modifiers | `Control+Option+Shift+Command`. |
| Karabiner | Selected profile is `OmniWM Master Profile`. Preserve its intentional Right Command and Right Option layers. |
| Caps guard fallback | `karabiner/assets/complex_modifications/caps_guard_FALLBACK_disabled.json` stays inactive. Enable only as an explicitly agreed replacement for Raycast's Hyper generator. |
| Normal editing | Left Command must support copy, paste, undo, redo, and arrow navigation. Shift selection must end when Shift is released. |

Right Command and Right Option are intentionally custom layer keys. Do not
"repair" them into ordinary modifiers or remove their OmniWM bindings without
the user's agreement. Preserve normal editing through Left Command/Option.
Do not enable two generators for Caps Lock Hyper.

## Where changes actually land

`~/.config` is a directory symlink to `~/.mac-setup/.config`. These are the
same live files, not a staging copy. This directory is its own Git repository,
separate from the enclosing `~/.mac-setup` bootstrap repository.

- OmniWM: `omniwm/settings.toml`, including the distinct modifiers on each hotkey.
- Karabiner: `karabiner/karabiner.json`, including the selected profile and layer rules.
- Raycast keyboard preferences: app-managed settings outside this repository.
  A branch switch alone does not restore these preferences.

Resolve symlinks and identify the Git root before editing. Inspect the branch,
local changes, and the proposed file diff before checkout, restore, deploy, or
bootstrap operations. Do not overwrite live keyboard files from another branch
or an old backup just because that version is tracked. Preserve unrelated work.

## Before changing anything

1. Establish the authorized scope. An eqMac export backup should only copy the
   requested exports, never restore dotfiles or reset keyboard settings.
2. Read the live settings and check for another agent or app writing them.
   Avoid simultaneous keyboard edits across threads.
3. Save a timestamped backup outside the files the app watches. Record the
   exact fields being changed and the rollback path.
4. Preserve modifier distinctions. `Control+Shift+Command+1` and
   `Control+Option+Shift+Command+1` are different shortcuts. Do not normalize
   both into `Hyper+1` when Hyper includes all four modifiers.
5. Prefer the app's supported reload. Do not stop OmniWM casually: the user
   relies on its workspace visibility and layout while working. If a restart
   is necessary for the authorized repair, explain its effect first.
6. Inspect the saved config again after reload or a settings-window save.
   Check that serialization or migration has not collapsed the modifiers.

## Verification

Check the configuration and the actual editing behavior. A valid TOML file,
green Hyper indicator, or successful restart alone does not prove recovery.

Read-only checks:

```sh
git -C ~/.config status --short
git -C ~/.config diff -- omniwm/settings.toml karabiner/karabiner.json
hidutil property --matching keyboard --get UserKeyMapping
defaults read com.raycast.macos raycast_HyperKeySecureInputMode
'/Library/Application Support/org.pqrs/Karabiner-Elements/bin/karabiner_cli' --show-current-profile-name
```

Inspect TOML hotkeys for duplicate resolved chords, expanding `Hyper` using
`general.hyperKeyModifiers`. Check the same scope before declaring a collision.
Important existing distinctions include:

- `switchWorkspace.0`: `Control+Shift+Command+1`.
- `moveToWorkspace.0`: `Hyper+1`, meaning all four modifiers plus 1.
- `focusColumn.0`: `Control+Option+1`.
- `move.left`: `Control+Option+Shift+Left Arrow`.
- `focus.left`: `Hyper+Left Arrow`.

Repeat the workspace checks for numbers 1 through 9. Compare other bindings
with the current agreed baseline; do not blindly restore all settings from an
old file. One pre-existing duplicate remains on `Hyper+P` for scratchpad toggle
and assignment. It was left unchanged and needs a separate decision.

In a disposable TextEdit document, verify normal text, Left Cmd+A/C/V/Z,
Left Cmd+Shift+Z, Cmd+arrows, and Shift selection followed by release. Then
verify Caps Lock Hyper and the intentional Right Command/Option layers. Leave
the user's clipboard and real documents intact. If the issue is intermittent,
report that limitation instead of claiming a permanent fix.

Do not indiscriminately clear HID mappings, synthesize modifiers, revoke
permissions, reset all app settings, or recommend formatting. First identify
the owner and isolate one component at a time within the authorized scope.

## October 1 incident and recovery

Observed: paste/undo failures, reported arrow-navigation and selection glitches,
and OmniWM shortcut-registration errors. Both Raycast and OmniWM were configured
to generate Caps Lock Hyper. Their observed HID mappings differed: OmniWM used
F18; Raycast with compatibility off used F20. Those key choices are implementation
details observed on this machine, not permanent requirements.

Comparison with `omniwm/settings.toml.pre-v3`, dated September 14, found 46
bindings whose distinct modifier combinations had become `Hyper` shortcuts.
The repair restored only those 46 bindings, set OmniWM's Caps Lock trigger to
`None`, cleared stale Caps Lock mappings, and reopened Raycast. The original
Karabiner profile and custom layers were preserved. The user subsequently
reported Cmd+V/Z working again. Arrow navigation and intermittent selection
were not separately confirmed fixed.

The exact cause and time of the modifier collapse are unknown. There is no
established evidence that an eqMac backup or a branch switch caused it.

Recovery references on this Mac:

- `omniwm/settings.toml.before-keyboard-repair-20261001-234203` and its
  `.changes.json` manifest record the pre-repair config and 46 changed bindings.
- `~/Library/Application Support/Keyboard-Recovery/20261001-232627/` contains
  the earlier Raycast/Karabiner backups and recovery notes.
- `Keyboard recovery - normal typing` is an extra diagnostic Karabiner profile,
  not the intended daily profile.

These notes guide future work; they do not automatically enforce settings or
prevent apps from rewriting them.


## October 5 workspace bar timer restoration

The user's Right Command/Right Option bar behavior stopped because commit
73942dc removed bar_manager.sh --hold and --release from both layer triggers.
Restored only those four shell calls in the selected OmniWM Master Profile.
Preserved Right Shift disabling, Escape layer reset, all layer bindings, and
300ms tap timeout. Karabiner logged a live reload at 20:12:11 without restarting
OmniWM. Direct helper verification passed: hold showed the bar; release kept it
visible after 1s and hid it at 5.19s. Physical trigger testing remains for the user.
Pre-change backup: ~/Library/Application Support/Keyboard-Recovery/20261005-201211-bar-timer/karabiner.json.
