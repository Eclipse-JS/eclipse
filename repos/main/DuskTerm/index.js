qb.enableRegularRequire();

// Port of ttysh to the window server

let textfb = "";
let inputfb = "";
let inputIsActive = false;

require("./constants.js");

const ws = Kernel.extensions.get("WindowServer");
const ui = Kernel.extensions.get("LibDawn");

const theme = ui.themes.getTheme(ui.themes.getDefaultTheme());

await ws.createWindow(512, 512, async function(canvasElement, update, addEventListener) {
  canvasElement.title = "DuskTerm | " + shell;
  update();

  const ctx = canvasElement.getContext("2d");

  require("./draw/functions.js");

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
  
    const filter = bannedKbdKeys.filter(ban => e.key.startsWith(ban));
    if (filter.length != 0) return;
  
    inputfb += e.key;
  
    redraw(textfb + inputfb);
  });
  
  const input = require("./inputbindings.js");
  
  const binData = VFS.read(shell);
  await Kernel.process.spawn(i, binData.replaceAll("UWU;;\n\n", ""), [input]);
});