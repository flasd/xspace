import { exec } from "child_process";

// Async function to run a command in a given directory
export const runCommand = (
  command: string,
  args: string[],
  directory: string
) => {
  return new Promise<string>((resolve, reject) => {
    exec(
      `${command} ${args.join(" ")}`,
      { cwd: directory },
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(stdout);
      }
    );
  });
};
