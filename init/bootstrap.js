if (!VFS) {
  throw "No filesystem found!";
  window.location.reload();
}

if (!VFS.existsSync("/bin")) {
  //VFS.mkdir("/bin");
}

const ctx = Kernel.display.getFramebuffer();

ctx.font = "14px monospace";
ctx.fillStyle = "white";
ctx.fillText(
  "Installing core packages",
  2,
  12
);

Sys.drawLogo();
Sys.loadPercent(15);