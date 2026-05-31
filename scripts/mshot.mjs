// True mobile-emulated screenshot via Chrome DevTools Protocol (Node built-in WebSocket).
// usage: node mshot.mjs <url> <outfile> [fullHeightPx]
import fs from "node:fs";

const [, , url, out, fullH] = process.argv;
const DEV = "http://127.0.0.1:9222";

const res = await fetch(`${DEV}/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" }).catch(() => null)
  || await fetch(`${DEV}/json/new?${encodeURIComponent("about:blank")}`, { method: "POST" });
const target = await res.json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const m = ++id;
    pending.set(m, resolve);
    ws.send(JSON.stringify({ id: m, method, params }));
  });
const events = {};
const once = (name) => new Promise((r) => (events[name] = r));

ws.addEventListener("message", (e) => {
  const msg = JSON.parse(e.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg.result);
    pending.delete(msg.id);
  } else if (msg.method && events[msg.method]) {
    const r = events[msg.method];
    delete events[msg.method];
    r(msg.params);
  }
});
await new Promise((r) => ws.addEventListener("open", r));

const height = fullH ? parseInt(fullH, 10) : 844;
await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: 390,
  height,
  deviceScaleFactor: 3,
  mobile: true,
  screenWidth: 390,
  screenHeight: height,
});
await send("Emulation.setTouchEmulationEnabled", { enabled: true });
const loaded = once("Page.loadEventFired");
await send("Page.navigate", { url });
await loaded;
await new Promise((r) => setTimeout(r, 3500)); // let maps/animation settle
const { data } = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: !!fullH });
fs.writeFileSync(out, Buffer.from(data, "base64"));
console.log("saved", out);
ws.close();
process.exit(0);
