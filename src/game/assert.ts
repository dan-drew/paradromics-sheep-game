export function assert(what: any | undefined) {
  if (what === null || what == undefined) {
    throw new Error(`${what} isn't defined`);
  }
}
