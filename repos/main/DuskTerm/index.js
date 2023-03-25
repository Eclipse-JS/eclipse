qb.enableRegularRequire();

const ws = await Kernel.extensions.get("WindowServer");
const VFS = await Kernel.extensions.get("Vfs");

let textfb = "";
let inputfb = "";
let inputIsActive = false;

require("./constants.js");
require("./draw/functions.js");

await ws.createWindow(300, 300, 300, 300, async function main(win, addEventListener, removeEventListener) {
  win.title = "DuskTerm_v2 | Loading binary...";
  win.appendChild(fbTTYData);

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
    win.scrollTo(0, win.scrollHeight);
  });

  const oldInput = await Kernel.extensions.get("input");
  const input = require("./inputbindings.js");

  oldInput.registerInput(input);

  const binData = await VFS.read(shell);
  win.title = "DuskTerm_v2 | " + shell;

  const process = Kernel.process.create(binData.replaceAll("UWU;;\n\n", ""));
  await Kernel.process.spawn(i, process, []);
});