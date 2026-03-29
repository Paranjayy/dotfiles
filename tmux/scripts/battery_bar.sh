#!/bin/bash
# Battery bar - shows colored blocks based on battery level + charging indicator

# Get battery info
batt_info=$(pmset -g batt 2>/dev/null)
batt=$(echo "$batt_info" | grep -Eo '[0-9]+%' | head -1 | sed 's/%//')
charging=$(echo "$batt_info" | grep -c "AC connected\|charging")

if [ -z "$batt" ]; then
    echo "N/A"
    exit 0
fi

batt_int=${batt}

# Bar blocks (10 max)
bar=""
filled=$((batt_int / 10))
for i in $(seq 1 10); do
    if [ $i -le $filled ]; then
        bar="${bar}█"
    else
        bar="${bar}░"
    fi
done

# Charging indicator
if [ $charging -gt 0 ]; then
    charge_icon="⚡"
else
    charge_icon="🔋"
fi

# Color based on level
if [ $batt_int -gt 70 ]; then
    color="#55FD05"  # Green
elif [ $batt_int -gt 40 ]; then
    color="#FFD30E"  # Yellow
elif [ $batt_int -gt 20 ]; then
    color="#FC7D02"  # Orange
else
    color="#F30003"  # Red
fi

# If charging, show green regardless
if [ $charging -gt 0 ]; then
    color="#55FD05"
fi

echo "#[fg=${color}]${charge_icon} ${bar} ${batt}%"
