qb.enableRegularRequire();

const ws = await Kernel.extensions.get("WindowServer");
const VFS = await Kernel.extensions.get("Vfs");

let textfb = "";
let inputfb = "";
let inputIsActive = false;

require("./constants.js");
require("./draw/functions.js");

// Measured from conhost.exe from Windows 10/11
await ws.createWindow(300, 300, 970, 500, async function main(win, addEventListener, removeEventListener, container) {
  win.title = "DuskTerm_v2 | Loading binary...";
  win.appendChild(fbTTYData);

  // In this context it makes sense to unlock scrolling. So, let's do that.
  container.style.overflow = "scroll";

  addEventListener("keydown", function(e) {
    if (!inputIsActive) return;
  
    if (e.key == "Enter") {
      inputIsActive = false;
      return;
    }
  
    if (e.key == "Backspace") {
      inputfb = inputfb.slice(0, -1);
      redraw(textfb + inputfb);
      return;
    }
  
    if (e.key.length > 1) return;
  
    inputfb += e.key;
  
    redraw(textfb + inputfb);
  });

  const oldInput = await Kernel.extensions.get("input");
  const input = require("./inputbindings.js");

  oldInput.registerInput(input);

  const binData = await VFS.read(shell);
  win.title = "DuskTerm | " + shell;

  const process = Kernel.process.create(binData.replaceAll("UWU;;\n\n", ""));
  await Kernel.process.spawn(i, process, []);
});