import { Action, ActionPanel, Color, Icon, List } from "@raycast/api";
import { readFileSync } from "fs";
import { useEffect, useState } from "react";

interface Shortcut {
  action: string;
  keys: string;
}

export default function Command() {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const content = readFileSync("/Users/paranjay/.config/omniwm/WORKFLOW.md", "utf-8");
      const lines = content.split("\n");
      const list: Shortcut[] = [];

      for (const line of lines) {
        if (line.startsWith("- **") || line.startsWith("- **")) {
          const match = line.match(/-\s+\*\*(.*?):\*\*\s+`(.*?)`/);
          if (match && match[1] && match[2]) {
            list.push({
              action: match[1].trim(),
              keys: match[2].trim(),
            });
          }
        }
      }
      setShortcuts(list);
    } catch (error) {
      setShortcuts([
        { action: "Switch Workspace", keys: "rcmd + [1-9]" },
        { action: "Move Window to Workspace", keys: "rcmd + Shift + [1-9]" },
        { action: "Focus Window (WASD)", keys: "ropt + WASD" },
        { action: "Move Window (WASD)", keys: "ropt + Shift + WASD" },
        { action: "Toggle Workspace Layout", keys: "rcmd + L" }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <List isLoading={loading} searchBarPlaceholder="Search shortcuts...">
      <List.Section title="OmniWM & Karabiner Hotkeys">
        {shortcuts.map((sc, index) => (
          <List.Item
            key={index}
            title={sc.action}
            subtitle={sc.keys}
            icon={{ source: Icon.Keyboard, tintColor: Color.Purple }}
            actions={
              <ActionPanel>
                <Action.CopyToClipboard title="Copy Shortcut" content={sc.keys} />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
    </List>
  );
}
