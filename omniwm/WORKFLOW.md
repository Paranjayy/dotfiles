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

### Right Command (`rcmd`) Held Layer
- **Trigger:** Sets `rcmd_layer = 1`.
- **System Mappings:** Maps physical key inputs to virtual combinations that OmniWM parses as direct commands.
- **Raycast Shortcut:** `ropt + space` is assigned to your Raycast trigger (while your system's normal Raycast hotkey is `opt + space`).
- **Brightness & Audio Patches:** `rcmd/ropt + Shift + Brightness/Audio` keys are successfully patched via Karabiner.

---

## 3. Hotkeys & Actions Map

### Workspace Controls
- **Switch Workspace (1 - 9):** `rcmd + [1-9]` (simulates `Option + [1-9]`).
- **Move Window to Workspace (1 - 9):** `rcmd + Shift + [1-9]` (simulates `Option + Shift + [1-9]`).
- **Toggle Last Workspace:** `ropt + Tab` (simulates `Control + Option + Tab`).
- **Move Window/Column Up/Down Workspaces:** `rcmd + W` (to next workspace) / `rcmd + S` (to previous workspace).
- **Move Column to Workspace (Pages):** `Control + Option + Shift + Page Up / Page Down`.

### Window Navigation & Focus
- **Directional Focus (WASD):** `ropt + WASD` (simulates arrow navigation). Focuses windows left/right/up/down (up/down focus is primarily active on Dwindle layouts).
- **Focus Previous Window:** `ropt + Tab` (simulates `Control + Option + Tab`).
- **Focus Window by Index (1 - 9):** `ropt + [1-9]` (simulates `Control + Option + [1-9]`).
- **Move Column to Index (1 - 9):** `ropt + Shift + [1-9]` (optional future mapping to move active columns to particular positions).

### Column Operations & Sizing
- **Move Column Left/Right:** `rcmd + A` / `rcmd + D`.
- **Toggle Column Tabbed Mode:** `Option + T`.
- **Cycle Column Width Presets:** `rcmd + ]` / `rcmd + [` (simulates `Control + Shift + Command + Right/Left Bracket`).
- **Resize Window Sizing (10% increments):**
  - **Grow Column Width:** `rcmd + "+"` (simulates `Control + Shift + Command + Equal`).
  - **Shrink Column Width:** `rcmd + "-"` (simulates `Control + Shift + Command + Minus`).
- **Balance Sizing:** `Option + Shift + B` (unassigned to rcmd/ropt layers).

### Global Utilities
- **Toggle Fullscreen:** `rcmd + F` (simulates `Control + Shift + Command + F`).
- **Open Command Palette:** `rcmd + Space` (simulates `Control + Shift + Command + Space`).
- **Raise All Floating Windows:** `rcmd + R` (simulates `Control + Shift + Command + R`).
- **Toggle Focused Window Floating:** `rcmd + G` (simulates `Control + Shift + Command + G`).
- **Assign Window to Scratchpad:** `rcmd + P` (simulates `Control + Option + Command + P`).
- **Toggle Workspace Bar Visibility:** `rcmd + B` (simulates `Control + Option + B`). 
  - *Karabiner Macro:* Shows the bar for 5 seconds when holding `rcmd` / `ropt`, or keeps it visible during active command inputs.
- **Toggle Quake Terminal:** `rcmd + \`` / `rcmd + Q` (simulates `Control + Option + Grave`).
- **Toggle Workspace Layout Type (Niri ↔ Dwindle):** `rcmd + L` (simulates `Control + Shift + Command + L`).
- **Toggle Overview HUD:** `rcmd + O` (simulates `Control + Shift + Command + O`).
