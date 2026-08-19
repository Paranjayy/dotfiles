# Goated OmniWM & Karabiner System Configuration & Workflow

This document details your complete window management, keyboard layout, macros, and shortcut configuration based directly on your goated `/Users/paranjay/Downloads/settings.toml` configuration.

---

## 1. Core Layout Architecture (OmniWM)

- **Default Layouts:**
  - **Workspaces 1 to 7:** Run on the **Niri Layout** (infinite scrolling horizontal ribbon of columns).
  - **Workspaces 8 & 9:** Run on the **Dwindle Layout** (binary space partitioning trees, like BSPWM/Hyprland).
- **Workspace-to-Monitor Assignments:**
  - Workspaces 1-5 and 8-9 assign to the **Main Monitor**.
  - Workspaces 6 & 7 (named `❤️` and `🚀`) assign to the **Secondary Monitor**.
- **Window Rules (`[[appRules]]`):**
  - Most utility and system preference windows (like `com.apple.systempreferences`) default to **Float Layout** so they do not tile and disrupt the screen grid.
  - Development tools (Ghostty, Chrome, Zed, Zen, Safari) have custom minimum dimensions constraints (`minWidth`, `minHeight`) so they never scale down to unusable sizes.

---

## 2. Keyboard Layer Mapping (Karabiner-Elements)

Your setup uses two primary modifier layers triggered by holding keys on the right side of the keyboard. This allows you to trigger complex shortcuts without needing awkward hand stretches.

1. **Right Command (`rcmd`) Held:**
   - Temporarily sets `rcmd_layer = 1`.
   - Remaps number keys `1-9` to output `Control+Shift+Command + [1-9]`.
   - Remaps modifiers combined with numbers to output `Control+Option+Shift+Command + [1-9]`.
   - Remaps `W`/`A`/`S`/`D` to direction keys.
2. **Right Option (`ropt`) Held:**
   - Temporarily sets `right_opt_layer = 1`.
   - Remaps `W`/`A`/`S`/`D` to output arrow keys combined with `Control+Option+Shift+Command` (for navigation) or `Control+Option+Shift` (for movement).

---

## 3. Hotkeys & Actions Map

### Workspace Controls
- **Switch Workspace (1 - 9):** `Control + Shift + Command + [1-9]` (triggered by holding `rcmd` + pressing number keys).
- **Move Window to Workspace (1 - 9):** `Control + Option + Shift + Command + [1-9]` (triggered by holding `rcmd` + `Shift` + pressing number keys).
- **Toggle Last Workspace:** `Control + Shift + Command + Tab`
- **Move Window Up/Down Workspaces:** `Control + Shift + Command + W / S`
- **Move Column Up/Down Workspaces:** `Control + Option + Shift + Page Up / Page Down`

### Window Navigation & Focus
- **Directional Focus (WASD):** `Control + Option + Shift + Command + Arrow Keys` (triggered by holding `ropt` + WASD).
- **Focus Previous Window:** `Control + Option + Tab` (triggered by holding `ropt` + Tab).
- **Focus Column by Index (1 - 9):** `Control + Option + [1-9]` (triggered by holding `ropt` + number keys).

### Directional Window Movement & Sizing
- **Move Window Directionally (WASD):** `Control + Option + Shift + Arrow Keys` (triggered by holding `ropt` + `Shift` + WASD).
- **Move Column Left/Right:** `Control + Shift + Command + A / D`
- **Toggle Column Tabbed Mode:** `Control + Option + T`
- **Cycle Column Width Presets:** `Control + Shift + Command + Right Bracket` (Forward) / `Control + Shift + Command + Left Bracket` (Backward)
- **Resize Window Sizing (10% increments):**
  - **Grow/Shrink Column Width:** `Control + Shift + Command + Equal` (Increase) / `Control + Shift + Command + Minus` (Decrease)
- **Balance Sizing:** `Option + Shift + B`

### Global Utilities
- **Toggle Fullscreen:** `Control + Shift + Command + F`
- **Open Command Palette:** `Control + Shift + Command + Space`
- **Raise All Floating Windows:** `Control + Shift + Command + R`
- **Toggle Focused Window Floating:** `Control + Shift + Command + G`
- **Assign Focused Window to Scratchpad:** `Control + Option + Command + P`
- **Toggle Scratchpad Window:** `Control + Shift + Command + P`
- **Open Menu Anywhere:** `Control + Option + M`
- **Toggle Workspace Bar Visibility:** `Control + Option + B`
- **Toggle Quake Terminal:** `Control + Option + Grave (``)`
- **Toggle Workspace Layout Type (Niri ↔ Dwindle):** `Control + Shift + Command + V`
- **Toggle Overview HUD:** `Control + Shift + Command + O`
