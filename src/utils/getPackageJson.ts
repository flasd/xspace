import fs from "fs/promises";
import { logError } from "./logger";

type PackageJson = {
  name: string;
  xspace?: {
    packages?: string[];
  };
  scripts?: {
    [key: string]: string | undefined;
  };
};

export async function getPackageJson(
  packageJsonPath: string
): Promise<PackageJson> {
  try {
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf8"));
    return packageJson as PackageJson;
  } catch (error) {
    logError(error, true);
  }

  process.exit(1);
}
