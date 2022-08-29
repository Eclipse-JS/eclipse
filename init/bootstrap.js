if (!VFS) {
  throw "No filesystem found!";
}

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

fillText("Downloading packages: ", 2);
const data = JSON.parse(await fetchTextData("repos/main/packages.json"));
Sys.loadPercent(20);

fillText(" - Init dependencies", 3);

// UWU;; with 2 new lines is the header for the JavaScript executables
const sysData = "UWU;;\n\n" + await fetchTextData("/init/sys.js");

VFS.write("/bin/sys", sysData);

fillText(" - Command line", 4);
const sh = "UWU;;\n\n" + await fetchTextData("repos/main/" + data.sh.path);
const ttysh = "UWU;;\n\n" + await fetchTextData("repos/main/" + data.ttysh.path);

VFS.write("/bin/sh", sh);
VFS.write("/bin/ttysh", ttysh);

Sys.loadPercent(30);

fillText(" - Package manager", 5);

const packageManager = "UWU;;\n\n" + await fetchTextData("repos/main/" + data.pkg.path);
VFS.write("/bin/pkg", packageManager);
Sys.loadPercent(45);

fillText("Configuring packages...", 6);
if (!VFS.existsSync("/etc/init.d", "folder")) VFS.mkdir("/etc/init.d");

VFS.write("/etc/init.d/init.conf", "/bin/ttysh");
VFS.write("/etc/ttysh.conf", "shell=/bin/sh");

Sys.loadPercent(50);

fillText("Rebooting system...", 8);
window.location.reload();