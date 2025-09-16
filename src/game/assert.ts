export function assert(what: any | undefined, message: string = 'Assertion failed!') {
  if (what === null || what == undefined) {
    console.trace(message)
    alert(message)
    throw new Error(message);
  }
}
