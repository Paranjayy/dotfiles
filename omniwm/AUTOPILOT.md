# OmniWM & Karabiner Autopilot Backlog & Roadmap

This document outlines the backlog of features, optimizations, and experiments to implement for the window management setup.

---

## 1. Native Modifier Passthrough Algorithm (OmniWM Application)
- **Goal:** Allow left-modifier combinations (e.g. `lopt` or `lcmd` commands) to trigger normal macOS behavior without being swallowed by OmniWM.
- **Concept:** Write an event filter inside OmniWM's Event Intake pipeline:
  - If a hotkey combination matches a registered hotkey, intercept it.
  - If a combination contains `lopt` / `lcmd` but does not match any registered hotkeys, pass it back to the macOS window server event queue immediately using `CGEventPost`.

## 2. Karabiner Right-Option & Right-Command Optimization
- **Goal:** Native macOS accessibility permissions sometimes interfere with Karabiner.
- **Concept:** Implement a fallback native Swift event handler inside our OmniWM fork to capture raw `rcmd` and `ropt` holds and toggle workspace layers without relying on Karabiner at all.

## 3. Raycast Extension V2 Features
- **Goal:** Extend the consolidated dashboard with deeper layout control.
- **Features:**
  - **Restore Layout Preset:** Save the active window layout arrangement (e.g., specific grid coordinates and column spans) to a JSON file and restore it with one click.
  - **Menu Bar Status Upgrades:** Auto-refresh the workspace layout indicators using the `subscribe` WebSocket stream of `omniwmctl` instead of 3-second polling.

## 4. Fork Maintenance (`patch/v0.4.9.6` ↔ `main`)
- **Goal:** Bring custom patches (like `KeySymbolMapper`) forward into the latest v0.6.2 build of OmniWM.
- **Concept:** Create a new branch `patch/v0.6.2`, pull the latest upstream, and re-apply our custom Swift modifications.
