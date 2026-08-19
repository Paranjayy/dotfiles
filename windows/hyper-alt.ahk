#Requires AutoHotkey v2.0
#SingleInstance Force

; ============================================
; Right-Alt Hyper Key for Komorebi
; Makes only Right Alt trigger WM commands
; Left Alt stays normal for menus/shortcuts
; ============================================

; ── Disable Left Alt for WM combos ────────────────────────────
; Left Alt + WASD/1-9 does nothing (prevents accidental triggers)
LAlt & w::Return
LAlt & a::Return
LAlt & s::Return
LAlt & d::Return
LAlt & 1::Return
LAlt & 2::Return
LAlt & 3::Return
LAlt & 4::Return
LAlt & 5::Return
LAlt & g::Return
LAlt & f::Return
LAlt & q::Return
LAlt & BackSpace::Return

; ── Right Alt + WASD = Focus (like right+opt+wasd) ────────────
RAlt & w::Send "{Alt up}{Ctrl down}{Alt down}w{Alt up}{Ctrl up}"
RAlt & a::Send "{Alt up}{Ctrl down}{Alt down}a{Alt up}{Ctrl up}"
RAlt & s::Send "{Alt up}{Ctrl down}{Alt down}s{Alt up}{Ctrl up}"
RAlt & d::Send "{Alt up}{Ctrl down}{Alt down}d{Alt up}{Ctrl up}"

; ── Right Alt + Shift + WASD = Move (like right+cmd+wasd) ─────
RAlt & Shift::Return  ; Prevent sticky shift
RAlt & w::
    If GetKeyState("Shift", "P")
        Send "{Alt up}{Ctrl down}{Shift down}{Alt down}w{Alt up}{Shift up}{Ctrl up}"
    Else
        Send "{Alt up}{Ctrl down}{Alt down}w{Alt up}{Ctrl up}"
Return

RAlt & a::
    If GetKeyState("Shift", "P")
        Send "{Alt up}{Ctrl down}{Shift down}{Alt down}a{Alt up}{Shift up}{Ctrl up}"
    Else
        Send "{Alt up}{Ctrl down}{Alt down}a{Alt up}{Ctrl up}"
Return

RAlt & s::
    If GetKeyState("Shift", "P")
        Send "{Alt up}{Ctrl down}{Shift down}{Alt down}s{Alt up}{Shift up}{Ctrl up}"
    Else
        Send "{Alt up}{Ctrl down}{Alt down}s{Alt up}{Ctrl up}"
Return

RAlt & d::
    If GetKeyState("Shift", "P")
        Send "{Alt up}{Ctrl down}{Shift down}{Alt down}d{Alt up}{Shift up}{Ctrl up}"
    Else
        Send "{Alt up}{Ctrl down}{Alt down}d{Alt up}{Ctrl up}"
Return

; ── Right Alt + 1-5 = Switch workspace ────────────────────────
RAlt & 1::Send "{Alt up}{Ctrl down}{Alt down}1{Alt up}{Ctrl up}"
RAlt & 2::Send "{Alt up}{Ctrl down}{Alt down}2{Alt up}{Ctrl up}"
RAlt & 3::Send "{Alt up}{Ctrl down}{Alt down}3{Alt up}{Ctrl up}"
RAlt & 4::Send "{Alt up}{Ctrl down}{Alt down}4{Alt up}{Ctrl up}"
RAlt & 5::Send "{Alt up}{Ctrl down}{Alt down}5{Alt up}{Ctrl up}"

; ── Right Alt + Shift + 1-5 = Move to workspace ───────────────
RAlt & Shift & 1::Send "{Alt up}{Ctrl down}{Shift down}{Alt down}1{Alt up}{Shift up}{Ctrl up}"
RAlt & Shift & 2::Send "{Alt up}{Ctrl down}{Shift down}{Alt down}2{Alt up}{Shift up}{Ctrl up}"
RAlt & Shift & 3::Send "{Alt up}{Ctrl down}{Shift down}{Alt down}3{Alt up}{Shift up}{Ctrl up}"
RAlt & Shift & 4::Send "{Alt up}{Ctrl down}{Shift down}{Alt down}4{Alt up}{Shift up}{Ctrl up}"
RAlt & Shift & 5::Send "{Alt up}{Ctrl down}{Shift down}{Alt down}5{Alt up}{Shift up}{Ctrl up}"

; ── Right Alt + G = Toggle float ──────────────────────────────
RAlt & g::Send "{Alt up}{Ctrl down}{Alt down}g{Alt up}{Ctrl up}"

; ── Right Alt + F = Fullscreen ────────────────────────────────
RAlt & f::Send "{Alt up}{Ctrl down}{Alt down}f{Alt up}{Ctrl up}"

; ── Right Alt + Q = Quake terminal ────────────────────────────
RAlt & q::Send "{Alt up}{Ctrl down}{Alt down}q{Alt up}{Ctrl up}"

; ── Right Alt + ` = Quake terminal (alt) ──────────────────────
RAlt & `::Send "{Alt up}{Ctrl down}{Alt down}`{Alt up}{Ctrl up}"

; ── Right Alt + BackSpace = Close window ──────────────────────
RAlt & BackSpace::Send "{Alt up}{Ctrl down}{Shift down}{Alt down}x{Alt up}{Shift up}{Ctrl up}"
