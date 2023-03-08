qb.enableRegularRequire();

const input = Kernel.extensions.get("input");
const VFS = Kernel.extensions.get("Vfs");

// I KNOW I KNOW I KNOW
// That I shouldn't tamper with legacy code.
// However,
// Having non-matching themes is killing me.
function extensionExists(name) {
  try {
    Kernel.extensions.get(name);
    return true;
  } catch (e) {
    return false;
  }
}

if (!extensionExists("LibreDawn")) {
  input.stdout("WM<WARN>: UI Framework is not running. Attempting to start...\n");
  if (!VFS.existsSync("/bin/dawn", "file")) {
    input.stdout("WM<FATAL> UI Framework is not installed! Aborting...\n");
    return false;
  } else if (Kernel.accounts.getCurrentInfo().permLevel != 0) {
    input.stdout("WM<FATAL>: I am not running as root so I cannot load the UI. Sorry!\n");
    return false;
  }
  
  const dawnData = VFS.read("/bin/dawn");

  // Pipe all stdout and input to null -- It gets logged to the console anyways
  Kernel.process.spawn("/bin/dawn", dawnData.replaceAll("UWU;;\n\n", ""), []);
}

const dawnV2 = Kernel.extensions.get("LibreDawn");

require("./ThemeLoader.js");

function isRoot() {
  // If we have permission level 0, we are effectively root

  return Kernel.accounts.getCurrentInfo().permLevel == 0;
}

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

if (!isRoot()) {
  input.stdout("ERROR: I'm not running as root! Cannot load kernel module, aborting.\n");
  return;
}

const handler = {
  themes: dawnV2.themes
}

require("./UIGenerator/index.js")
handler.UIGenerator = UIGenerator;

Kernel.extensions.load("LibDawn", handler);