#!/usr/bin/env python3
"""Shift-stuck watcher: logs modifier flaps with frontmost app, auto-clears
phantom Shift when CG says stuck but HID hardware reports all-up.

Log: ~/Library/Logs/shift-watch.log
Safe: only synthesizes key-up when hardware (hidutil) shows no key down.
"""
import ctypes
import subprocess
import plistlib
import time
from datetime import datetime

LOG = "/Users/paranjay/Library/Logs/shift-watch.log"
STUCK_SECS = 3  # CG-stuck this long with HID all-up -> clear + log

cg = ctypes.CDLL(
    "/System/Library/Frameworks/CoreGraphics.framework/CoreGraphics"
)
cg.CGEventSourceKeyState.argtypes = [ctypes.c_int, ctypes.c_uint16]
cg.CGEventSourceKeyState.restype = ctypes.c_bool
cg.CGEventSourceFlagsState.argtypes = [ctypes.c_int]
cg.CGEventSourceFlagsState.restype = ctypes.c_uint64
cg.CGEventCreateKeyboardEvent.argtypes = [
    ctypes.c_void_p,
    ctypes.c_uint16,
    ctypes.c_bool,
]
cg.CGEventCreateKeyboardEvent.restype = ctypes.c_void_p
cg.CGEventSetFlags.argtypes = [ctypes.c_void_p, ctypes.c_uint64]
cg.CGEventPost.argtypes = [ctypes.c_uint32, ctypes.c_void_p]

SHIFT_BIT = 1 << 17


def log(msg):
    line = f"{datetime.now():%Y-%m-%d %H:%M:%S} {msg}"
    print(line, flush=True)
    with open(LOG, "a") as f:
        f.write(line + "\n")


def cg_shift_stuck():
    active = [k for k in range(256) if cg.CGEventSourceKeyState(1, k)]
    flags = cg.CGEventSourceFlagsState(1)
    stuck = 56 in active or 60 in active or bool(flags & SHIFT_BIT)
    return stuck, active, flags


def hid_any_down():
    try:
        out = subprocess.check_output(["hidutil", "dump"], timeout=5)
        data = plistlib.loads(out)
    except Exception as e:
        return None
    for item in data.get("ServiceRecords", []):
        if item.get("IOClass") in (
            "AppleHIDKeyboardEventDriverV2",
            "AppleHIDKeyboardEventDriver",
        ):
            for ev in item.get("EventLog", [])[-3:]:
                if ev.get("Down") == 1:
                    return True
    return False


def frontmost():
    try:
        out = subprocess.check_output(
            ["osascript", "-e",
             'tell application "System Events" to get name of first process whose frontmost is true'],
            timeout=5,
        )
        return out.decode().strip()
    except Exception:
        return "?"


def clear_shift():
    for kc in (56, 60):
        for sess in (0, 1):
            ev = cg.CGEventCreateKeyboardEvent(None, kc, False)
            cg.CGEventSetFlags(ev, 0)
            cg.CGEventPost(sess, ev)


def main():
    log("watcher start")
    stuck_since = None
    last_logged = None
    while True:
        stuck, active, flags = cg_shift_stuck()
        now = time.time()
        if stuck:
            hid_down = hid_any_down()
            if hid_down is False:  # phantom: CG stuck, hardware up
                if stuck_since is None:
                    stuck_since = now
                    log(f"PHANTOM? cg={active} flags={hex(flags)} app={frontmost()}")
                elif now - stuck_since >= STUCK_SECS:
                    clear_shift()
                    log(f"CLEARED phantom shift after {STUCK_SECS}s app={frontmost()}")
                    stuck_since = None
            else:  # physically held (or hid unknown) -> just note once
                if last_logged != "held":
                    log(f"held cg={active} flags={hex(flags)} app={frontmost()}")
                    last_logged = "held"
                stuck_since = None
        else:
            stuck_since = None
            last_logged = None
        time.sleep(0.5)


if __name__ == "__main__":
    main()
