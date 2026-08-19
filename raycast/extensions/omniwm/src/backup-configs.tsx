import { showHUD, showToast, Toast } from "@raycast/api";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);
const REPO_PATH = "/Users/paranjay/.mac-setup/.config";

export default async function Command() {
  const toast = await showToast({
    style: Toast.Style.Animated,
    title: "Backing up configs...",
  });

  try {
    // Stage the files
    await execPromise(`git -C ${REPO_PATH} add omniwm/settings.toml omniwm/WORKFLOW.md karabiner/karabiner.json`);
    
    // Commit the changes
    const commitMsg = `backup: raycast auto-sync on ${new Date().toLocaleString()}`;
    await execPromise(`git -C ${REPO_PATH} commit -m "${commitMsg}"`);
    
    // Push the commits
    await execPromise(`git -C ${REPO_PATH} push origin main`);

    toast.style = Toast.Style.Success;
    toast.title = "Configs backed up successfully!";
    await showHUD("Dotfiles synced to GitHub!");
  } catch (error: any) {
    // If there is nothing to commit, capture it gracefully
    if (error.stdout && error.stdout.includes("nothing to commit")) {
      toast.style = Toast.Style.Success;
      toast.title = "Configs are already up to date!";
    } else {
      toast.style = Toast.Style.Failure;
      toast.title = "Failed to backup configs";
      toast.message = error.message;
    }
  }
}
