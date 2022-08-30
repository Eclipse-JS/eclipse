const VFS = Kernel.extensions.get("Vfs");
const Sys = Kernel.extensions.get("sys");
const users = Kernel.extensions.get("users");

async function fetchTextData(url) {
  const data = await fetch(url);
  const dataText = await data.text();

  return dataText;
}

const ctx = Kernel.display.getFramebuffer();

function fillText(text, count) {
  ctx.font = "14px monospace";
  ctx.fillStyle = "white";
  ctx.fillText(
    text,
    2,
    12 * (count + count * 0.5)
  );
}

fillText("Bootstrapping directories...", 1)
if (!VFS.existsSync("/home", "folder")) VFS.mkdir("/home");
if (!VFS.existsSync("/root", "folder")) VFS.mkdir("/root");
if (!VFS.existsSync("/etc", "folder")) VFS.mkdir("/etc");
if (!VFS.existsSync("/usr", "folder")) VFS.mkdir("/usr");
if (!VFS.existsSync("/bin", "folder")) VFS.mkdir("/bin");

Sys.drawLogo();
Sys.loadPercent(15);

fillText("Downloading packages:", 2);
const data = JSON.parse(await fetchTextData("repos/main/packages.json"));
Sys.loadPercent(20);

fillText(" - VFS", 3);
const vfs = "UWU;;\n\n" + await fetchTextData("init/vfs.js");

localStorage.setItem("preboot_vfs", vfs);

let indexes = 3;

for (const index of Object.keys(data.packages)) {
  indexes++;
  fillText(" - " + index, indexes);

  const script = "UWU;;\n\n" + await fetchTextData("repos/main/" + data.packages[index].path);
  VFS.write("/bin/" + index, script);

  const percent = ((indexes-2)/Object.keys(data.packages).length)*100;

  Sys.loadPercent(percent);
}

fillText("Configuring packages...", indexes+2);
if (!VFS.existsSync("/etc/init.d", "folder")) VFS.mkdir("/etc/init.d");

VFS.write("/etc/init.d/init.conf", "/bin/net");
VFS.write("/etc/init.d/initcmd.txt", "/bin/ttysh");
VFS.write("/etc/ttysh.conf", "shell=/bin/sh");

users.addUser("root", ["root"], 0, "toor");

fillText("Rebooting system...", indexes+3);
window.location.reload();