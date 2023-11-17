import PrettyError from "pretty-error";

const pe = new PrettyError();

export function logError<T extends boolean>(
  error: Error,
  exit: T
): T extends true ? never : void {
  const rendered = pe.render(error);
  console.log(rendered);

  if (exit) {
    process.exit(1);
  }

  return undefined as any;
}
