qb.enableRegularRequire();

const VFS = Kernel.extensions.get("Vfs");
const kprint = Kernel.extensions.get("kprint");

async function fetchTextData(url) {
  const data = await fetch(url);
  const dataText = await data.text();

  return dataText;
}

const fb = Kernel.display.getFramebuffer(true);
const fbText = fb.createElement("div");
fbText.className = "fb_text";

fbText.style.fontFamily = "monospace";
fbText.style.fontSize = "14px";

fb.appendChild(fbText);

function fillText(text) {
  kprint.log("boostrap: " + text);
}

kprint.log("boostrap: Setting up directories...");
require("./loadDir.js");

kprint.log("bootstrap: Downloading packages...");
const data = JSON.parse(await fetchTextData("repos/coreutils/packages.json"));

let indexes = 2;

require("./installAll.js");

kprint.log("boostrap: Configuring packages...");
if (!VFS.existsSync("/etc/init.d", "folder")) VFS.mkdir("/etc/init.d");

require("./initCfg.js");

fbText.remove();