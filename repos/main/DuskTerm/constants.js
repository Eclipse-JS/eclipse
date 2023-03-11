qb.enableRegularRequire();

const fontSize = 14;

const fb = Kernel.display.getFramebuffer(true);
const fbTTYData = fb.createElement("div");
fbTTYData.className = "fb_tty_data";

fbTTYData.style.fontFamily = "monospace";
fbTTYData.style.fontSize = fontSize + "px";

const shell = "/bin/sh";

// TODO
/*
const config = VFS.read("/etc/ttysh.conf").split("\n");
const shell = config.filter(item => item.startsWith("shell="))[0].split("=")[1];
*/