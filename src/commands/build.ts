import path from "path";
import { runCommand } from "../utils/runCommand";
import { logError } from "../utils/logger";

// Function to run 'yarn build' in given directories
export const build = async (packageRootPaths: string[], args: string[]) => {
  try {
    await Promise.all(
      packageRootPaths.map((path) => runCommand("yarn build", args, path))
    );
  } catch (error) {
    logError(error, true);
    process.exit(1);
  }
};
