qb.enableRegularRequire();

// Checks to see if the window (and if a window manager) has started
let hasWindowServerStarted = false;
let hasWindowManagerRegistered = false;

let focusedUUID = null;
const wmConf = {};

const input = Kernel.extensions.get("input");
const kprint = Kernel.extensions.get("kprint");

require("./Functions/logger.js");
require("./Functions/convert.js");
require("./Functions/checkIfRoot.js");
require("./Functions/uuidV4.js");

require("./Functions/EventProxy.js");

logf("Checking if I am running as root...");

if (!isRoot()) {
  logf("\nYou must be root to start the window server!");
  return 1;
}

logf(" [ok]\nAttempting to fetch framebuffer...");

const framebuffer = Kernel.display.getFramebuffer(true);
framebuffer.getElementsByClassName("fb_tty_data")[0].style.visibility = "hidden"; // Hides the TTY

const wsData = framebuffer.createElement("div");
wsData.style.position = "absolute";
wsData.style.zIndex = "10";
wsData.style.top = "0px";
wsData.style.left = "0px";
wsData.style.width = "100%";
wsData.style.height = "100%";
wsData.style.backgroundColor = "black";

const background = framebuffer.createElement("img");
background.style.position = "absolute";
background.style.zIndex = "11";
background.style.top = "0px";
background.style.left = "0px";
background.style.width = "100%";
background.style.height = "100%";

wsData.appendChild(background);
framebuffer.appendChild(wsData);

logf(" [ok]\n");
hasWindowServerStarted = true;

Kernel.extensions.load("WindowServer", function() {
  require("./IPCLayer/index.js");
}, true);

while (true) {
  await new Promise((i) => setTimeout(i, 1000*1000));
}