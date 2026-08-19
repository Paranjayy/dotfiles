import { Action, ActionPanel, Color, Icon, List, showHUD, showToast, Toast } from "@raycast/api";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);
const CTL_BIN = "/Applications/OmniWM.app/Contents/MacOS/omniwmctl";

const WORKSPACES = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

async function switchWorkspace(workspace: string) {
  try {
    await execPromise(`${CTL_BIN} switch-workspace ${workspace}`);
    await showHUD(`Switched to Workspace ${workspace}`);
  } catch (error: any) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to switch workspace",
      message: error.message,
    });
  }
}

export default function Command() {
  return (
    <List searchBarPlaceholder="Search workspace...">
      <List.Section title="Workspaces">
        {WORKSPACES.map((ws) => (
          <List.Item
            key={ws}
            title={`Workspace ${ws}`}
            icon={{ source: Icon.Circle, tintColor: Color.Blue }}
            actions={
              <ActionPanel>
                <Action title="Switch to Workspace" onAction={() => switchWorkspace(ws)} />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
    </List>
  );
}
