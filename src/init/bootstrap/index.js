qb.enableRegularRequire();

const VFS = Kernel.extensions.get("Vfs");
const Sys = Kernel.extensions.get("sys");

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
  fbText.innerHTML += text + "\n"
    .replaceAll("<", "&#60;")
    .replaceAll(">", "&#62;")
    .replaceAll("\n", "<br>")
    .replaceAll(" ", "&nbsp;");
}

fillText("Bootstrapping directories...", 1)
require("./loadDir.js");

Sys.drawLogo();
Sys.loadPercent(15);

fillText("Downloading packages:", 2);
const data = JSON.parse(await fetchTextData("repos/coreutils/packages.json"));
Sys.loadPercent(20);

fillText(" - VFS", 3);
const vfs = "UWU;;\n\n" + await fetchTextData("init/vfs.js");

localStorage.setItem("preboot_vfs", vfs);

let indexes = 3;

require("./installAll.js");

fillText("Configuring packages...", indexes+2);
if (!VFS.existsSync("/etc/init.d", "folder")) VFS.mkdir("/etc/init.d");

require("./initCfg.js");

fbText.remove();