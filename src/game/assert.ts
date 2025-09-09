export function assert(what: any | undefined) {
  if (what === null || what == undefined) {
    console.trace('Assertion failed!')
    throw new Error(`Assertion failed!`);
  }
}
