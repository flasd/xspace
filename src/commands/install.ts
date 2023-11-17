import { getPackageJson } from "../utils/getPackageJson";
import { logError } from "../utils/logger";
import { runCommand } from "../utils/runCommand";

// Function to run 'yarn install' in given directories
export const installOne = async (path: string, args: string[]) => {
  try {
    await runCommand("yarn install", args, path);
  } catch (error) {
    logError(error, true);
    process.exit(1);
  }
};

const linkOne = async (path: string, name: string, otherPaths: string[]) => {
  // run yarn link in path
  try {
    await runCommand("yarn link", [], path);
  } catch (error) {
    logError(error, true);
    process.exit(1);
  }

  // then run yarn link name in all other paths
  try {
    await Promise.all(
      otherPaths.map((path) => runCommand("yarn link " + name, [], path))
    );
  } catch (error) {
    logError(error, true);
    process.exit(1);
  }
};

export async function install(packageRootPaths: string[], args: string[]) {
  try {
    await Promise.all(packageRootPaths.map((path) => installOne(path, args)));

    // then run yarn link name in all other paths
    const packages = await Promise.all(
      packageRootPaths.map(async (path) => {
        const pkg = await getPackageJson(path + "/package.json");
        return {
          packageJson: pkg,
          path,
        };
      })
    );

    for (const pkg of packages) {
      const otherPackages = packages.filter(
        (p) => p.packageJson.name !== pkg.packageJson.name
      );
      await linkOne(pkg.path, pkg.packageJson.name, otherPackages.map(p => p.path));
    }
  } catch (error) {
    logError(error, true);
    process.exit(1);
  }
}
