import { showHUD, showToast, Toast } from "@raycast/api";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);
const CTL_BIN = "/Applications/OmniWM.app/Contents/MacOS/omniwmctl";

export default async function Command() {
  try {
    await execPromise(`${CTL_BIN} toggle-workspace-bar-visibility`);
    await showHUD("Toggled Workspace Bar");
  } catch (error: any) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to toggle workspace bar",
      message: error.message,
    });
  }
}
