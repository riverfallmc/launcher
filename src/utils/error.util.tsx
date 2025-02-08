export function caughtError(err: any): Error {
  return new Error(err instanceof Error ? err.message : String(err));
}