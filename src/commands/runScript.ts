import { getPackageJson } from "../utils/getPackageJson";

// Function to run a script in given directories
export const runScript = async (packageRootPaths: string[], scriptName: string, args: string[]) => {
  try {
    await Promise.all(
      packageRootPaths.map(async (path) => {
        const pkg = await getPackageJson(path + "/package.json");
        if (pkg.scripts && pkg.scripts[scriptName]) {
          await runCommand("yarn " + scriptName, args, path);
        }
      })
    );
  } catch (error) {
    logError(error, true);
    process.exit(1);
  }
};