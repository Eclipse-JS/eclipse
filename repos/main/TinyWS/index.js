qb.enableRegularRequire();

let hasStarted = false;
let hasWMStarted = false;

let focusedUUID = null;

let windows = [];

let wmConf = {};

const fbFPSLock = 1000/60; // Should be about ~80fps

require("./ckernel.js")

require("./functions.js")

const input = Kernel.extensions.get("input");

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

//const fbTime = calcFPS(fbFPSLock);

while (true) {
  // Repaint all windows every (by default) 60ms -- I don't have any better ideas
  // FIXME (won't fix myself, yet): Make dynamic system for repainting all windows only when items get updated

  // Hacky solution to get root element - Should be fine as we are running as root
  const rootElem = document.getElementById("framebuffer");

  const newFB = generateCanvas(rootElem.width, rootElem.height);
  const fbContext = newFB.getContext('2d');

  fbContext.fillStyle = "black";
  fbContext.fillRect(0, 0, rootElem.width, rootElem.height);

  let danglingItem;

  const newArray = windows.map(function(i) {
    if (i.uuid == focusedUUID) {
      danglingItem = i;
      return;
    }

    return i;
  });
p
  if (danglingItem) newArray.push(danglingItem);

  if (wmConf.wallpaper) newFB.drawImage(wmConf.wallpaper, 0, 0, rootElem.width, rootElem.height);

  for (const i of newArray) {
    if (!i) continue;

    const canvas = i.fetchCanvas();

    // Write to screen
    fbContext.drawImage(canvas, convertCSSStyleToJS(canvas.style.top), convertCSSStyleToJS(canvas.style.left));

    if (i.outerCanvas) {
      const height = i.outerCanvas.disableConversion ? convertCSSStyleToJS(canvas.style.left) : convertCSSStyleToJS(canvas.style.left) - i.outerCanvas.height;

      fbContext.drawImage(i.outerCanvas, convertCSSStyleToJS(canvas.style.top), height);
    }
  }

  framebuffer.drawImage(newFB, 0, 0);

  if (cKernel.verInfo.isBeta) {
    framebuffer.font = '12px system-ui';
    framebuffer.fillStyle = 'white';

    const textSize = framebuffer.measureText(Kernel.verInfo.displayVer);
    framebuffer.fillText(Kernel.verInfo.displayVer, rootElem.width-textSize.width-2, rootElem.height-2)
  }

  await new Promise(r => setTimeout(r, fbFPSLock));
}