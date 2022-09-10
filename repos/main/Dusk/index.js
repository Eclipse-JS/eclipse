qb.enableRegularRequire();

const args = argv;
const input = args.shift();

input.stdout("WM: Dusk is starting up...\n");
input.stdout("WM: Attempting to negotiate deals with the Window Server...\n");

require("./functions.js");

const wsLoad = loadWS();
if (!wsLoad) return 1;

console.log("WM: Attempting to start IPC with the Window Server...");
const ws = Kernel.extensions.get("WindowServer");

if (ws.hasWMStarted) {
  console.log("WM<FATAL>: Another Window Manager is already running!");
  return;
}

console.log("WM: Attempting to register a Window Manager...");

ws.registerWM("ProjectDusk", function(data) {
  console.log(data);
});

createTestWindow();

while (true) {
  await new Promise(r => setTimeout(r, 5000));
}