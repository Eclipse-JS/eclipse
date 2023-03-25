qb.enableRegularRequire();

const framebuffer = Kernel.display.getFramebuffer(true);

const VFS = await Kernel.extensions.get("Vfs");
const input = await Kernel.extensions.get("input");
const kprint = await Kernel.extensions.get("kprint");

input.stdout("WM: Dusk is starting up...\n");
input.stdout("WM: Attempting to negotiate deals with the Window Server...\n");

require("./Functions/extensionExists.js");
require("./Functions/exec.js");
require("./Functions/LoadWS.js");

const mvEvents = {
  mouseup: [],
  mousemove: []
};

function subscribeMouseMove(func) {
  if (typeof func == "function") mvEvents.mousemove.push(func);
}

document.body.addEventListener("mousemove", function(e) {
  for (const event of mvEvents.mousemove) {
    try {
      event(e);
    } catch (e) {
      console.error(e);
    }
  }
})

function subscribeMouseUp(func) {
  if (typeof func == "function") mvEvents.mouseup.push(func);
}

document.body.addEventListener("mouseup", function(e) {
  for (const event of mvEvents.mouseup) {
    try {
      event(e);
    } catch (e) {
      console.error(e);
    }
  }
})

const wsLoad = await loadWS();
if (!wsLoad) return 1;

const dawn = await Kernel.extensions.get("LibreDawn");
const theme = dawn.themes.getTheme(dawn.themes.getDefaultTheme());

kprint.log("WM: Attempting to start IPC with the Window Server...");
const ws = await Kernel.extensions.get("WindowServer");

if (ws.hasWMStarted) {
  kprint.log("WM<FATAL>: Another Window Manager is already running!");
  return;
}

kprint.log("WM: Attempting to register a Window Manager...");

const wmData = ws.registerWM("ProjectDusk_RevII");
wmData.outputWrapper(require("./Callback/index.js"));

const loginSysExists = await VFS.exists("/bin/lg_gls");

if (!(await VFS.exists("/etc/sonnesvr", "folder"))) await VFS.mkdir("/etc/sonnesvr");
if (!(await VFS.exists("/etc/sonnesvr/dusk.conf.json", "file"))) await VFS.write("/etc/sonnesvr/dusk.conf.json", JSON.stringify({
  autoStart: loginSysExists ? "/bin/lg_gls" : "/bin/lg_duskterm"
}));

const conf = JSON.parse(await VFS.read("/etc/sonnesvr/dusk.conf.json"));
if (await VFS.exists(conf.autoStart, "file")) {
  exec(conf.autoStart, []);
} else {
  console.warn("Autostart program does not exist!");
}

while (true) {
  await new Promise(r => setTimeout(r, 5000));
}