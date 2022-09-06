qb.enableRegularRequire();

let hasStarted = false;

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

debugger;

log("INFO: Attempting to allocate 256x256 framebuffer...");
generateCanvas(256, 256);

while (true) {
  await new Promise(r => setTimeout(r, 5000));
}