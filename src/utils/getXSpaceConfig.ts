import fs from "fs/promises";
import path from "path";
import glob from "glob";
import { getPackageJson } from "./getPackageJson";

// Helper function to check if a file exists
const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

// Function to read xspace configuration from package.json, moving up the directory tree
export const getXSpaceConfig = async (currentDir = process.cwd()) => {
  let currentPath = currentDir;
  const root = path.parse(currentPath).root;

  while (true) {
    const packageJsonPath = path.join(currentPath, "package.json");

    if (await fileExists(packageJsonPath)) {
      const packageJson = await getPackageJson(packageJsonPath);
      if (packageJson?.xspace) {
        return packageJson.xspace?.packages || [];
      }
    }

    if (currentPath === root) {
      throw new Error(
        "No package.json with xspace configuration found up to the root directory."
      );
    }

    // Move up one directory level
    currentPath = path.dirname(currentPath);
  }
};

