qb.enableRegularRequire();

const fontSize = 14;

const VFS = Kernel.extensions.get("Vfs");

const fb = Kernel.display.getFramebuffer(true);
const fbTTYData = fb.createElement("div");
fbTTYData.className = "fb_tty_data";

fbTTYData.style.fontFamily = "monospace";
fbTTYData.style.fontSize = fontSize + "px";

fb.appendChild(fbTTYData);

const configUnparsed = await VFS.read("/etc/ttysh.conf");
const config = configUnparsed.split("\n");
const shell = config.filter(item => item.startsWith("shell="))[0].split("=")[1];