#!/usr/bin/env bash
# Automatically assigns unique VSCode titlebar colors (Peacock style) to all projects
# Usage: ./vscode-colorize.sh [target_directory]

TARGET_DIR="${1:-$HOME/Developer}"

# A list of deep, muted jewel tones tailored for dark themes (not too bright)
COLORS=(
    "#2D1B2E" "#1B2A2D" "#2C2D1B" "#2D1C1B" "#1D1B2D" 
    "#12223A" "#3A1B1B" "#1F3A1B" "#3A1B30" "#3A2A1B"
    "#22332E" "#172A3A" "#33182C" "#261D33" "#332611"
)

echo "🎨 Auto-configuring VSCode Workspace Colors in $TARGET_DIR"

# Loop through all directories in the target folder
for d in "$TARGET_DIR"/*/; do
    # Skip if not a directory
    [ -d "$d" ] || continue
    
    # Check if a .git folder exists to ensure it's an actual project
    if [ -d "${d}.git" ] || [ -f "${d}package.json" ] || [ -f "${d}README.md" ]; then
        PROJECT_NAME=$(basename "$d")
        VSCODE_DIR="${d}.vscode"
        SETTINGS_FILE="${VSCODE_DIR}/settings.json"
        
        # Pick a random color
        RANDOM_COLOR=${COLORS[$RANDOM % ${#COLORS[@]}]}
        
        # Create .vscode dir if it doesn't exist
        mkdir -p "$VSCODE_DIR"
        
        # If settings.json exists, we update it, otherwise create it
        if [ -f "$SETTINGS_FILE" ]; then
            # Use Node.js to safely inject the color properties without breaking existing JSON
            node -e "
                const fs = require('fs');
                const file = '$SETTINGS_FILE';
                let data = {};
                try { data = JSON.parse(fs.readFileSync(file)); } catch (e) {}
                const color = '$RANDOM_COLOR';
                data['workbench.colorCustomizations'] = data['workbench.colorCustomizations'] || {};
                data['workbench.colorCustomizations']['titleBar.activeBackground'] = color;
                data['workbench.colorCustomizations']['titleBar.inactiveBackground'] = color + '99'; // 60% opacity
                data['workbench.colorCustomizations']['titleBar.activeForeground'] = '#F8F8F2';
                fs.writeFileSync(file, JSON.stringify(data, null, 2));
            "
        else
            # Create a fresh settings.json
            cat <<EOF > "$SETTINGS_FILE"
{
  "workbench.colorCustomizations": {
    "titleBar.activeBackground": "$RANDOM_COLOR",
    "titleBar.inactiveBackground": "${RANDOM_COLOR}99",
    "titleBar.activeForeground": "#F8F8F2"
  }
}
EOF
        fi
        
        echo "✅ Configured \e[38;2;$(printf "%d;%d;%d" 0x${RANDOM_COLOR:1:2} 0x${RANDOM_COLOR:3:2} 0x${RANDOM_COLOR:5:2})m$PROJECT_NAME\e[0m with color $RANDOM_COLOR"
    fi
done

echo "🎉 Done! Open any project in VSCode and watch the title bars light up."
