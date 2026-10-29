// Node 25 ships its own global localStorage, which shadows jsdom's and has no working methods
// unless Node is started with --localstorage-file. Point the global back at jsdom's storage.
/* global jsdom */
if (typeof globalThis.jsdom !== "undefined") {
  Object.defineProperty(globalThis, "localStorage", { value: jsdom.window.localStorage, configurable: true, writable: true });
  Object.defineProperty(globalThis, "sessionStorage", { value: jsdom.window.sessionStorage, configurable: true, writable: true });
}
