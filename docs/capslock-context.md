# CapsLock / Hyper Key / Menubar Context — handoff for future agents

Date: 2026-09-21. Owner formats Mac soon, then re-checks if LED bug is patched.
Read this first so the user doesn't have to re-explain.

## Machine
- MacBook Air, macOS 27.0 (build 26A428), Apple Silicon.
- Karabiner-Elements installed (`/Applications/Karabiner-Elements.app`).
- Raycast installed, user LOVES Raycast Hyper Key, wants to keep it ON.

## Issue 1 — Accidental CapsLock / Hyper mispress (FIXED, user-side)
- Before: Raycast > Settings > Keyboard > Hyper Key = Caps Lock, Quick Press = Trigger Caps Lock.
  Every lone Caps tap toggled real Caps. User rarely uses real Caps but never-never.
- Fix applied by USER (2026-09-21): Quick Press → **Does Nothing**. Hold Caps + key = Hyper still works.
- Rare ALL-CAPS now: hold Shift while typing, or flip Quick Press back temporarily.
- Rule for agents: do NOT turn off Raycast Hyper. User explicitly rejected that.

## Issue 2 — CapsLock LED dimly lit when off (UNRESOLVED, vanilla macOS bug)
- Symptom: Caps LED glows faintly when inactive.
- Proven vanilla: persists with Raycast quit AND in Safe Mode. Not Karabiner (profile has
  zero caps_lock rules), not Raycast remap.
- Read-only findings (2026-09-21): system hidutil has leftover CapsLock (0x39) → F18 (0x6D)
  mapping on all keyboards — that's Raycast Hyper's doing and must stay while Hyper is on.
- Karabiner `virtual_hid_keyboard` = `{"keyboard_type_v2": "ansi"}`, no LED override set.
- Suspected: macOS 26/27 LED driver regression (Sequoia fine, some 26 builds patched it,
  27.0 broken again). Known threads: Apple Community "Caps Lock light not working after
  Tahoe update" (Apr 2026), Karabiner #3284 (fix = set Caps to No Action in Modifier Keys).
- Given reset steps (NOT yet done, user will test after format): turn OFF "Press Caps to
  switch input source", set Caps → No Action for BOTH Apple Internal + Karabiner VirtualHID,
  Full Keyboard Access OFF, full shutdown 30s (no SMC on Apple Silicon), re-test.
- After format: check if dim glow is gone on clean install BEFORE installing Raycast/Karabiner.
  If gone, install one at a time to find trigger. If still there on clean install, file
  Feedback Assistant bug against macOS 27.0.

## Issue 3 — Menubar clock reset on macOS updates (PATCHED in dotfiles)
- Symptom: major/minor updates wipe day-of-week, date, seconds from menubar clock.
- Live prefs at the time: `com.apple.menuextra.clock` DateFormat="EEE H:mm", ShowDate=1,
  ShowDayOfWeek=1, ShowSeconds=1 (format truncated = classic post-update state).
- Fix: added 4 entries to `/Users/paranjay/.mac-setup/defaults.json`:
  ShowDayOfWeek=true, ShowDate=true, ShowSeconds=true, DateFormat="EEE MMM d  H:mm:ss".
- Re-apply anytime: defaults write com.apple.menuextra.clock <key> ... ; killall ControlCenter.

## Files created / changed (all backed up to /tmp on 2026-09-21)
- CREATED (inactive, OFF by default): `~/.config/karabiner/assets/complex_modifications/caps_guard_FALLBACK_disabled.json`
  Tap Caps alone = nothing, hold + key = Hyper, Shift+Caps = real Caps. Enable ONLY if user
  turns OFF Raycast Hyper. Active `karabiner.json` profile (OmniWM Master Profile) UNTOUCHED.
- EDITED: `/Users/paranjay/.mac-setup/defaults.json` (added 4 clock entries, was 7 → now 11).
- Backups: `/tmp/karabiner.json.pre-caps-guard.bak`, `/tmp/defaults.json.pre-clock.bak`.

## User working style (respect this)
- Ask permission / pitch BEFORE changing anything. Read-only checks are fine.
- Don't break current config. Prefer reversible 1-click fixes, keep fallbacks OFF until asked.
- User is chaotic/brief — confirm understanding, keep replies short.

## After-format checklist for next agent
1. Ask if clean-install LED test passed (no Raycast/Karabiner installed yet?).
2. Re-apply menubar clock via mac-setup bootstrap or the defaults-write block above.
3. Re-enable Raycast Hyper (Caps Lock, Quick Press = Does Nothing, Include Shift ON).
4. Only if mispresses return: offer the Karabiner fallback file (import via Complex Modifications).
