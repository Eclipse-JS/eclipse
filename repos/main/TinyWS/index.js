qb.enableRegularRequire();

let hasStarted = false;
let hasWMStarted = false;

let windows = [];

let wmConf = {};

const fbFPSLock = 60; // 60fps

require("./ckernel.js")

require("./functions.js")

const args = argv;
const input = args.shift();

logf("Checking if I am running as root...");

if (!isRoot()) {
  input.stdout("You must be root to start the window server!");
  return;
}

logf(" [ok]\nAttempting to fetch framebuffer...");

const framebuffer = cKernel.display.getFramebuffer();

hasStarted = true;
logf(" [ok]\n");

log("INFO: Attempting to allocate 256x256 framebuffer...");
generateCanvas(256, 256);
log("INFO: Attempting to load Kernel Extension into kernel...");

cKernel.extensions.load("WindowServer", function() {
  require("./IPCLayer/index.js")
}, true);

const fbTime = calcFPS(fbFPSLock);

// Repaint all windows every said ms

while (true) {
  await new Promise(r => setTimeout(r, fbTime));
}