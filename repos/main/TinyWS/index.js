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

while (true) {
  // Repaint all windows every (by default) 60ms -- I don't have any better ideas
  // FIXME (won't fix myself, yet): Make dynamic system for repainting all windows only when items get updated

  // Hacky solution to get root element - Should be fine as we are running as root
  const rootElem = document.getElementById("framebuffer");

  const newFB = generateCanvas(rootElem.width, rootElem.height);
  const fbContext = newFB.getContext('2d');

  for (const i of windows) {
    const canvas = i.fetchCanvas();

    function convertCSSStyleToJS(item) {
      if (item.endsWith("px")) {
        return parseFloat(item.replace("px", ""));
      }

      return;
    }

    // Write to screen
    fbContext.drawImage(canvas, convertCSSStyleToJS(canvas.style.top), convertCSSStyleToJS(canvas.style.left));
  }

  // It *should* take up the entire screen, if not, something's wrong with your display. (or submit an issue)
  if (isCanvasBlank(newFB)) {
    framebuffer.fillStyle = "black";
    framebuffer.fillRect(0, 0, rootElem.width, rootElem.height);
  } else {
    framebuffer.drawImage(newFB, 0, 0);
  }

  await new Promise(r => setTimeout(r, fbTime));
}