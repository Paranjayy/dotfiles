#!/bin/bash
# CPU bar - shows colored blocks based on CPU usage
# Used in tmux status bar

cpu=$(top -l 1 | grep 'CPU usage' | awk '{print $3}' | sed 's/%//')
cpu_int=${cpu%.*}

# Bar blocks (10 max)
bar=""
for i in $(seq 1 10); do
    if [ $i -le $((cpu_int / 10)) ]; then
        bar="${bar}█"
    else
        bar="${bar}░"
    fi
done

# Color based on load
if [ $cpu_int -lt 30 ]; then
    echo "#[fg=#55FD05]${bar} ${cpu}%"
elif [ $cpu_int -lt 60 ]; then
    echo "#[fg=#FFD30E]${bar} ${cpu}%"
elif [ $cpu_int -lt 80 ]; then
    echo "#[fg=#FC7D02]${bar} ${cpu}%"
else
    echo "#[fg=#F30003]${bar} ${cpu}%"
fi
