#!/bin/bash

# Configuration
USER=${GH_USER:-paranjayy}
TIMEOUT=5
CACHE_DIR="$HOME/.cache/github"
STREAK_CACHE="$CACHE_DIR/streak.json"
PROFILE_CACHE="$CACHE_DIR/profile.env"
CACHE_TTL=3600 # 1 hour

# Ensure cache directory exists
mkdir -p "$CACHE_DIR"

# Function to fetch data from GitHub API
fetch_data() {
    local auth_header=""
    if [ -n "$GITHUB_TOKEN" ]; then
        auth_header="-H \"Authorization: token $GITHUB_TOKEN\""
    fi

    local tmp_profile="$CACHE_DIR/tmp_profile.json"
    local tmp_repos="$CACHE_DIR/tmp_repos.json"

    # 1. Basic Profile & Public Repos
    curl -s $auth_header --connect-timeout $TIMEOUT "https://api.github.com/users/$USER" > "$tmp_profile"
    if grep -q "message" "$tmp_profile"; then return 1; fi
    
    # 2. Received Stars (sum of all public repo stars)
    curl -s $auth_header --connect-timeout $TIMEOUT "https://api.github.com/users/$USER/repos?per_page=100" > "$tmp_repos"
    if grep -q "message" "$tmp_repos"; then return 1; fi

    local pub_repos=$(jq -r '.public_repos // 0' "$tmp_profile")
    local stars=$(jq '[.[].stargazers_count] | add // 0' "$tmp_repos")

    # 3. Starred Repositories (total given stars)
    local headers=$(curl -sI $auth_header --connect-timeout $TIMEOUT "https://api.github.com/users/$USER/starred?per_page=1")
    local starred=$(echo "$headers" | sed -n 's/.*&page=\([0-9]*\)>; rel="last".*/\1/p')
    if [ -z "$starred" ]; then
        starred=$(curl -s $auth_header --connect-timeout $TIMEOUT "https://api.github.com/users/$USER/starred?per_page=100" | jq 'length // 0')
    fi

    # 4. Private Repos
    local priv="N/A"
    if [ -n "$GITHUB_TOKEN" ]; then
        local user_data=$(curl -s -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user)
        if ! echo "$user_data" | grep -q "message"; then
            priv=$(echo "$user_data" | jq -r '.total_private_repos // 0')
        fi
    else
        priv="(No Token)"
    fi

    # Save profile to cache
    cat <<EOF > "$PROFILE_CACHE"
stars=$stars
starred=$starred
pub=$pub_repos
priv=$priv
updated=$(date +%s)
EOF

    # 5. Streak & Work Data (External API)
    curl -s --connect-timeout $TIMEOUT "https://github-contributions-api.deno.dev/$USER.json" > "$STREAK_CACHE"
    
    return 0
}

# Check cache validity
current_time=$(date +%s)
update_needed=0
if [ ! -f "$PROFILE_CACHE" ] || [ ! -f "$STREAK_CACHE" ]; then
    update_needed=1
else
    last_update=$(grep "updated=" "$PROFILE_CACHE" | cut -d= -f2)
    if [ $((current_time - last_update)) -gt $CACHE_TTL ]; then
        update_needed=1
    fi
fi

if [ $update_needed -eq 1 ]; then
    # Run fetch_data in the background
    (fetch_data > /dev/null 2>&1 &)
fi

# Load profile from cache if exists
if [ -f "$PROFILE_CACHE" ]; then
    source "$PROFILE_CACHE"
fi

# Output based on argument
case "$1" in
    profile)
        if [ -z "$stars" ] && [ -z "$pub" ]; then
            echo "⚠️ API Rate Limited. Please wait or set GITHUB_TOKEN."
        else
            echo "${stars:-0} ⭐ | ${starred:-0} Starred | ${pub:-N/A} Public | ${priv:-(No Token)} Private"
        fi
        ;;
    streak|work)
        if [ ! -f "$STREAK_CACHE" ] || [ ! -s "$STREAK_CACHE" ]; then
            if [ "$1" == "streak" ]; then echo "💔 Streak unavailable"; else echo "Work: N/A"; fi
            exit 0
        fi
        
        if [ "$1" == "streak" ]; then
            jq -r '.contributions[][] | "\(.date) \(.contributionCount)"' "$STREAK_CACHE" | awk '
            BEGIN { ls="N/A"; le="N/A"; ms="N/A"; me="N/A"; max=0; current_streak=0; today_idx=0 }
            { dates[NR] = $1; counts[NR] = $2; today_idx = NR }
            END {
                c = 0; s = ""; e = "";
                for (i = 1; i <= today_idx; i++) {
                    if (counts[i] > 0) { if (c == 0) s = dates[i]; c++; e = dates[i] }
                    else { if (c > max) { max = c; ms = s; me = e }; c = 0 }
                }
                if (c > max) { max = c; ms = s; me = e }
                c = 0; start_idx = today_idx; pending = 0
                if (counts[today_idx] == 0 && counts[today_idx-1] > 0) { pending = 1; start_idx = today_idx - 1 }
                if (counts[start_idx] > 0) {
                    e_cur = dates[start_idx]
                    for (i = start_idx; i >= 1; i--) { if (counts[i] > 0) { c++; s_cur = dates[i] } else break }
                }
                if (c > 0) {
                    if (pending) printf "⚠️ \033[1;33m%d days active (%s to %s) - Commit today!\033[0m | Max: %d (%s to %s)\n", c, s_cur, e_cur, max, ms, me
                    else printf "🔥 %d days active (%s to %s) | Max: %d (%s to %s)\n", c, s_cur, e_cur, max, ms, me
                } else printf "💔 0 days active | Max: %d (%s to %s)\n", max, ms, me
            }'
        else
            total_con=$(jq -r '.totalContributions // 0' "$STREAK_CACHE")
            counts_raw=$(jq -r '.contributions[][] | .contributionCount' "$STREAK_CACHE")
            today=$(echo "$counts_raw" | tail -n 1)
            week=$(echo "$counts_raw" | tail -n 7 | awk '{s+=$1} END {print s+0}')
            month=$(echo "$counts_raw" | tail -n 30 | awk '{s+=$1} END {print s+0}')
            echo "Total: $total_con | Today: $today | Week: $week | Month: $month"
        fi
        ;;
    *)
        last_update_str=$(date -r ${updated:-0} "+%H:%M" 2>/dev/null || echo "N/A")
        echo "$USER GitHub (Last Cached: $last_update_str)"
        ;;
esac
