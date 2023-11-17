import { glob } from "glob";
import { getXSpaceConfig } from "./getxSpaceConfig";
import { getPackageJson } from "./getPackageJson";
import { logError } from "./logger";

// Function to find package.json files based on xspace configuration
export const getXSpacePackages = async () => {
  try {
    const xspacePackages = await getXSpaceConfig();
    let packageFiles: string[] = [];

    for (const pattern of xspacePackages) {
      const found = await glob(pattern + "/package.json", {
        ignore: "**/node_modules/**",
      });
      packageFiles = packageFiles.concat(found);
    }

    return await Promise.all(
      packageFiles.map((packageJsonPath) => getPackageJson(packageJsonPath))
    );
  } catch (error) {
    logError(error, true);
  }
};
