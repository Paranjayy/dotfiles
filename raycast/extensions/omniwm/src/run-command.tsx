import { Action, ActionPanel, Color, Icon, List, showHUD, showToast, Toast } from "@raycast/api";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);
const CTL_BIN = "/Applications/OmniWM.app/Contents/MacOS/omniwmctl";

const DIRECTIONS = [
  { title: "Left", value: "left", icon: Icon.ArrowLeft },
  { title: "Right", value: "right", icon: Icon.ArrowRight },
  { title: "Up", value: "up", icon: Icon.ArrowUp },
  { title: "Down", value: "down", icon: Icon.ArrowDown }
];

const PRESETS = [
  { title: "Half Screen (50%)", value: "0.5", icon: Icon.Sidebar },
  { title: "Golden Ratio (61.8%)", value: "0.618", icon: Icon.Stars },
  { title: "Third Screen (33%)", value: "0.333", icon: Icon.Sidebar },
  { title: "Quarter Screen (25%)", value: "0.25", icon: Icon.AppWindow }
];

async function runOmniCommand(cmd: string) {
  try {
    await execPromise(`${CTL_BIN} ${cmd}`);
    await showHUD(`Executed: ${cmd}`);
  } catch (error: any) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Command failed",
      message: error.message,
    });
  }
}

export default function Command() {
  return (
    <List searchBarPlaceholder="Search native OmniWM commands...">
      <List.Section title="Navigation & Movement">
        <List.Item
          title="Focus Neighbor"
          subtitle="Switch focus to adjacent window"
          icon={{ source: Icon.Eye, tintColor: Color.Blue }}
          actions={
            <ActionPanel>
              {DIRECTIONS.map((dir) => (
                <Action
                  key={dir.value}
                  title={`Focus ${dir.title}`}
                  onAction={() => runOmniCommand(`focus ${dir.value}`)}
                />
              ))}
            </ActionPanel>
          }
        />
        <List.Item
          title="Move Window"
          subtitle="Swap current window with neighbor"
          icon={{ source: Icon.Switch, tintColor: Color.Orange }}
          actions={
            <ActionPanel>
              {DIRECTIONS.map((dir) => (
                <Action
                  key={dir.value}
                  title={`Move ${dir.title}`}
                  onAction={() => runOmniCommand(`move ${dir.value}`)}
                />
              ))}
            </ActionPanel>
          }
        />
        <List.Item
          title="Move Column"
          subtitle="Move the entire column"
          icon={{ source: Icon.ChevronUp, tintColor: Color.Purple }}
          actions={
            <ActionPanel>
              {DIRECTIONS.map((dir) => (
                <Action
                  key={dir.value}
                  title={`Move Column ${dir.title}`}
                  onAction={() => runOmniCommand(`move-column ${dir.value}`)}
                />
              ))}
            </ActionPanel>
          }
        />
      </List.Section>

      <List.Section title="Sizing Presets (Niri)">
        {PRESETS.map((preset) => (
          <List.Item
            key={preset.value}
            title={preset.title}
            icon={{ source: preset.icon, tintColor: Color.Green }}
            actions={
              <ActionPanel>
                <Action
                  title="Apply Width"
                  onAction={() => runOmniCommand(`set-column-width ${preset.value}`)}
                />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>

      <List.Section title="Layout Control">
        <List.Item
          title="Toggle Full Width"
          subtitle="Maximized column mode"
          icon={{ source: Icon.Maximize, tintColor: Color.Yellow }}
          actions={
            <ActionPanel>
              <Action title="Run Command" onAction={() => runOmniCommand("toggle-column-full-width")} />
            </ActionPanel>
          }
        />
        <List.Item
          title="Toggle Floating Window"
          subtitle="Switch between float and tile"
          icon={{ source: Icon.List, tintColor: Color.Magenta }}
          actions={
            <ActionPanel>
              <Action title="Run Command" onAction={() => runOmniCommand("toggle-focused-window-floating")} />
            </ActionPanel>
          }
        />
      </List.Section>
    </List>
  );
}
