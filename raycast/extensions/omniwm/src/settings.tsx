import { Action, ActionPanel, Color, Icon, List, showHUD, showToast, Toast } from "@raycast/api";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);
const CTL_BIN = "/Applications/OmniWM.app/Contents/MacOS/omniwmctl";

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
    <List searchBarPlaceholder="Search settings command...">
      <List.Section title="General Configurations">
        <List.Item
          title="Reload Configuration"
          subtitle="Reload settings.toml from disk"
          icon={{ source: Icon.Repeat, tintColor: Color.Green }}
          actions={
            <ActionPanel>
              <Action title="Reload" onAction={() => runOmniCommand("reload")} />
            </ActionPanel>
          }
        />
        <List.Item
          title="Toggle Animations"
          subtitle="Enable/Disable window animation transitions"
          icon={{ source: Icon.Circle, tintColor: Color.Blue }}
          actions={
            <ActionPanel>
              <Action title="Toggle" onAction={() => runOmniCommand("toggle-animations")} />
            </ActionPanel>
          }
        />
      </List.Section>
    </List>
  );
}
