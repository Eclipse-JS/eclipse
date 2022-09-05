qb.enableRegularRequire();

require("./constants.js");
require("./draw/functions.js");

let textfb = "";
let inputfb = "";
let inputIsActive = false;

Kernel.proxies.addEventListener("keydown", function(e) {
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
})

const input = require("./inputbindings.js");

const binData = VFS.read(shell);

const process = Kernel.process.create(binData.replaceAll("UWU;;\n\n", ""));
await Kernel.process.spawn(i, process, [input]);