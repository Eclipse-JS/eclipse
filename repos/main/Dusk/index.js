qb.enableRegularRequire();

const args = argv;
const input = args.shift();

const windows = [];

input.stdout("WM: Dusk is starting up...\n");
input.stdout("WM: Attempting to negotiate deals with the Window Server...\n");

require("./functions.js");

const wsLoad = loadWS();
if (!wsLoad) return 1;

console.log("WM: Attempting to start IPC with the Window Server...");
const ws = Kernel.extensions.get("WindowServer");
const ui = Kernel.extensions.get("LibDawn");

if (ws.hasWMStarted) {
  console.log("WM<FATAL>: Another Window Manager is already running!");
  return;
}

console.log("WM: Attempting to register a Window Manager...");

const wmData = ws.registerWM("ProjectDusk");

wmData.loadWM(require("./Callback/index.js"));
createTestWindow();

require("./MouseEvent/index.js");

while (true) {
  await new Promise(r => setTimeout(r, 5000));
}