qb.enableRegularRequire();

const framebuffer = Kernel.display.getFramebuffer(true);

const VFS = Kernel.extensions.get("Vfs");
const input = Kernel.extensions.get("input");

input.stdout("WM: Dusk is starting up...\n");
input.stdout("WM: Attempting to negotiate deals with the Window Server...\n");

require("./Functions/extensionExists.js");
require("./Functions/exec.js");
require("./Functions/LoadWS.js");

const wsLoad = loadWS();
if (!wsLoad) return 1;

console.log("WM: Attempting to start IPC with the Window Server...");
const ws = Kernel.extensions.get("WindowServer");
//const ui = Kernel.extensions.get("LibDawn");

if (ws.hasWMStarted) {
  console.log("WM<FATAL>: Another Window Manager is already running!");
  return;
}

console.log("WM: Attempting to register a Window Manager...");

const wmCallback = ws.registerWM("ProjectDusk_RevII", require("./Callback/index.js"));
//r.equire("./MouseEvent/index.js");

if (!VFS.existsSync("/etc/sonnesvr", "folder")) VFS.mkdir("/etc/sonnesvr");
if (!VFS.existsSync("/etc/sonnesvr/dusk.conf.json", "file")) VFS.write("/etc/sonnesvr/dusk.conf.json", JSON.stringify({
  autoStart: VFS.existsSync("/bin/gls") ? "/bin/gls" : "/bin/duskterm"
}));

const conf = JSON.parse(VFS.read("/etc/sonnesvr/dusk.conf.json"));
if (VFS.existsSync(conf.autoStart, "file")) {
  exec(conf.autoStart, []);
} else {
  console.warn("Autostart program does not exist!");
}

while (true) {
  await new Promise(r => setTimeout(r, 5000));
}