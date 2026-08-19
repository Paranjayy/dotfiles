# OmniWM & Karabiner System Configuration & Workflow

*Verified compatible and functional with: OmniWM v0.6.2*

This document details your complete window management, keyboard layout, macros, and shortcut configuration. It acts as a guide to understand the current setup or to port it to other tiling window managers (like Niri on Linux, or GlazeWM / Komorebi on Windows).

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

### 1. Right Command (`rcmd`) Held Layer
- **Trigger:** Sets `rcmd_layer = 1`.
- **Number Keys (1 - 9):** Remapped to output `Option + [1-9]`.
- **Shift + Number Keys (1 - 9):** Remapped to output `Option + Shift + [1-9]`.
- **W / A / S / D:** Remapped to output direction keys:
  - `A` / `D` remapped to `Control+Option+Shift+Left/Right Arrow`.
  - `W` / `S` remapped to `Control+Option+Shift+Up/Down Arrow`.
- **Space:** Remapped to output `Control+Shift+Command+Space`.
- **Return:** Remapped to output `Control+Shift+Command+F`.
- **Z (Zen Mode):** Triggers `~/.config/omniwm/zen.sh`.
- **B (Workspace Bar):** Triggers `~/.config/omniwm/bar_manager.sh --toggle`.
- **G:** Remapped to output `Control+Shift+Command+G`.
- **R:** Remapped to output `Control+Shift+Command+R`.
- **F:** Remapped to output `Control+Shift+Command+F`.
- **L:** Remapped to output `Control+Shift+Command+L`.
- **O:** Remapped to output `Control+Shift+Command+O`.
- **Grave (\`):** Remapped to output `Control+Option+Grave`.
- **Q:** Remapped to output `Control+Option+Grave`.

### 2. Right Option (`ropt`) Held Layer
- **Trigger:** Sets `right_opt_layer = 1`.
- **W / A / S / D:** Remapped to output direction keys combined with modifiers:
  - `W` / `A` / `S` / `D` (Normal) remapped to `Control+Option+Shift+Command + [Up/Left/Down/Right Arrow]`.
  - `W` / `A` / `S` / `D` (+ Shift) remapped to `Control+Option+Shift + [Up/Left/Down/Right Arrow]`.
- **Number Keys (1 - 9):** Remapped to output `Control+Option + [1-9]`.
- **Shift + Number Keys (1 - 9):** Remapped to output `Control+Option+Shift + [1-9]`.
- **Tab:** Remapped to output `Control+Option+Tab`.
- **Space:** Triggers Raycast search panel (system default: `Option + Space`).
- **Brightness & Audio Mappings:** `rcmd/ropt + Shift + brightness/audio` keys are patched via Karabiner.

---

## 3. Hotkeys & Actions Map

### Workspace Navigation (rcmd Layer Mappings)
- **Switch Workspace (1 - 9):** `rcmd + [1-9]` (triggers `Option + [1-9]`).
- **Move Window to Workspace (1 - 9):** `rcmd + Shift + [1-9]` (triggers `Option + Shift + [1-9]`).
- **Toggle Last Workspace:** `ropt + Tab` (triggers `Control + Option + Tab`).
- **Move Window/Column to Next/Prev Workspace:** `rcmd + W` (to Next workspace) / `rcmd + S` (to Prev workspace).
- **Move Column to Workspace (Pages):** `Control + Option + Shift + Page Up / Page Down`.

### Window Navigation & Focus (ropt Layer Mappings)
- **Directional Focus (WASD):** `ropt + WASD` (triggers `Control + Option + Shift + Command + Arrow Keys`). Focuses window left/right/up/down. (Note: up/down focus primarily functions on Dwindle layouts; up/down focus in Niri is currently broken as there are no direct up/down window moves).
- **Focus Previous Window:** `ropt + Tab` (triggers `Control + Option + Tab`).
- **Focus Column by Index (1 - 9):** `ropt + [1-9]` (triggers `Control + Option + [1-9]`).
- **Move Column to Index (1 - 9):** `ropt + Shift + [1-9]` (moves active column to a specific index).

### Column Operations & Sizing
- **Move Window/Column Left/Right:** `rcmd + A` / `rcmd + D` (triggers `Control + Option + Shift + Left/Right Arrow`).
- **Toggle Column Tabbed Mode:** `Option + T` (triggers `Option + T`).
- **Cycle Column Width Presets:** `rcmd + ]` (Forward) / `rcmd + [` (Backward) (triggers presets).
- **Resize Window Sizing (10% increments):**
  - **Grow Column Width:** `rcmd + "+"` (triggers `Control + Shift + Command + Equal`).
  - **Shrink Column Width:** `rcmd + "-"` (triggers `Control + Shift + Command + Minus`).
- **Balance Sizing:** `Option + Shift + B` (unassigned to layers).

### Global Utilities & Macros
- **Toggle Fullscreen:** `rcmd + F` (triggers `Control + Shift + Command + F`).
- **Open Command Palette:** `rcmd + Space` (triggers `Control + Shift + Command + Space`).
- **Raise All Floating Windows:** `rcmd + R` (triggers `Control + Shift + Command + R`).
- **Toggle Focused Window Floating:** `rcmd + G` (triggers `Control + Shift + Command + G`).
- **Assign Window to Scratchpad:** `rcmd + P` (triggers `Control + Option + Command + P`).
- **Toggle Workspace Bar Visibility:** `rcmd + B` (triggers `Control + Option + B`).
  - *Karabiner Integration:* Auto-reveals workspace bar for 5 seconds when holding `rcmd` / `ropt` or keeps it visible during active command inputs.
- **Toggle Quake Terminal:** `rcmd + \`` / `rcmd + Q` (triggers `Control + Option + Grave`).
- **Toggle Workspace Layout Type (Niri ↔ Dwindle):** `rcmd + L` (triggers `Control + Shift + Command + L`).
- **Toggle Overview HUD:** `rcmd + O` (triggers `Control + Shift + Command + O`).
