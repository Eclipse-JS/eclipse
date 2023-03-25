qb.enableRegularRequire();

const events = Kernel.extensions.get("eventListener");

require("./constants.js");
require("./draw/functions.js");

let textfb = "";
let inputfb = "";
let inputIsActive = false;

events.addEventListener("keydown", function(e) {
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
})

const oldInput = Kernel.extensions.get("input");
const input = require("./inputbindings.js");

oldInput.registerInput(input);

const binData = await VFS.read(shell);

const process = Kernel.process.create(binData.replaceAll("UWU;;\n\n", ""));
await Kernel.process.spawn(i, process, []);