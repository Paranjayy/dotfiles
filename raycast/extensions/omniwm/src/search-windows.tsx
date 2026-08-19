import { Action, ActionPanel, Color, Icon, List, showHUD, showToast, Toast } from "@raycast/api";
import { exec } from "child_process";
import { useEffect, useState } from "react";
import { promisify } from "util";

const execPromise = promisify(exec);
const CTL_BIN = "/Applications/OmniWM.app/Contents/MacOS/omniwmctl";

interface WindowItem {
  id: string;
  title: string;
  appName: string;
}

export default function Command() {
  const [windows, setWindows] = useState<WindowItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchWindows() {
      try {
        const { stdout } = await execPromise(`${CTL_BIN} list-windows --json`);
        const parsed = JSON.parse(stdout) as WindowItem[];
        setWindows(parsed);
      } catch (error) {
        try {
          const { stdout } = await execPromise(`${CTL_BIN} list-windows`);
          const lines = stdout.split("\n").filter(Boolean);
          const parsed = lines.map((line) => {
            const parts = line.split("|");
            return {
              id: parts[0]?.trim(),
              appName: parts[1]?.trim() || "Unknown App",
              title: parts[2]?.trim() || "Untitled Window",
            };
          });
          setWindows(parsed);
        } catch (err: any) {
          showToast({
            style: Toast.Style.Failure,
            title: "Failed to load windows",
            message: err.message,
          });
        }
      } finally {
        setLoading(false);
      }
    }
    fetchWindows();
  }, []);

  async function focusWindow(windowId: string) {
    try {
      await execPromise(`${CTL_BIN} focus-window ${windowId}`);
      await showHUD("Focused Window");
    } catch (error: any) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to focus window",
        message: error.message,
      });
    }
  }

  return (
    <List isLoading={loading} searchBarPlaceholder="Search active windows...">
      <List.Section title="Managed Windows">
        {windows.map((win) => (
          <List.Item
            key={win.id}
            title={win.appName}
            subtitle={win.title}
            icon={{ source: Icon.Window, tintColor: Color.Orange }}
            actions={
              <ActionPanel>
                <Action title="Focus Window" onAction={() => focusWindow(win.id)} />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
    </List>
  );
}
