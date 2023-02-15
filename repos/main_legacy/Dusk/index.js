qb.enableRegularRequire();

const VFS = Kernel.extensions.get("Vfs");

const input = Kernel.extensions.get("input");
const event = Kernel.extensions.get("eventListener");
const kprint = Kernel.extensions.get("kprint");

const windows = [];

input.stdout("WM: Dusk is starting up...\n");
input.stdout("WM: Attempting to negotiate deals with the Window Server...\n");

require("./functions.js");

const wsLoad = loadWS();
if (!wsLoad) return 1;

kprint.log("WM: Attempting to start IPC with the Window Server...");
const ws = Kernel.extensions.get("WindowServer");
const ui = Kernel.extensions.get("LibDawn");

if (ws.hasWMStarted) {
  kprint.log("WM<FATAL>: Another Window Manager is already running!");
  return;
}

kprint.log("WM: Attempting to register a Window Manager...");

const wmData = ws.registerWM("ProjectDusk");

wmData.loadWM(require("./Callback/index.js"));

require("./MouseEvent/index.js");

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