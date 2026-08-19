import { showHUD, showToast, Toast } from "@raycast/api";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);
const REPO_PATH = "/Users/paranjay/.mac-setup/.config";

export default async function Command() {
  const toast = await showToast({
    style: Toast.Style.Animated,
    title: "Restoring configs from GitHub...",
  });

  try {
    // Pull the latest updates
    await execPromise(`git -C ${REPO_PATH} pull origin main`);
    
    // Restart OmniWM to apply the updated settings
    await execPromise("killall OmniWM && sleep 1 && open -a OmniWM");

    toast.style = Toast.Style.Success;
    toast.title = "Configs restored and OmniWM reloaded!";
    await showHUD("Services synced and restarted!");
  } catch (error: any) {
    toast.style = Toast.Style.Failure;
    toast.title = "Failed to restore configs";
    toast.message = error.message;
  }
}
