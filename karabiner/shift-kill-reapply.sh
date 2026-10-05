#!/bin/bash
# Re-apply after every reboot (hidutil mappings are not persistent).
# Caps Lock -> Left Shift, both physical Shifts -> nothing.
hidutil property --matching '{"Product":"Apple Internal Keyboard / Trackpad"}' --set '{"UserKeyMapping":[{"HIDKeyboardModifierMappingSrc":30064771129,"HIDKeyboardModifierMappingDst":30064771297},{"HIDKeyboardModifierMappingSrc":30064771297,"HIDKeyboardModifierMappingDst":0},{"HIDKeyboardModifierMappingSrc":30064771301,"HIDKeyboardModifierMappingDst":0}]}'
