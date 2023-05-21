qb.enableRegularRequire();

async function extensionExists(name) {
  try {
    await Kernel.extensions.get(name);
    return true;
  } catch (e) {
    return false;
  }
}

async function exec(path, argv) {
  const VFS = await Kernel.extensions.get("Vfs");
    
  const file = await VFS.read(path);
  await Kernel.process.spawn(path, file.replace("UWU;;\n\n", ""), [...argv]);
}

const input = await Kernel.extensions.get("input");
const VFS = await Kernel.extensions.get("Vfs");

if (!(await extensionExists("pSBC"))) {
  console.log("Starting pSBC...");
  await exec("/bin/pSBC", []);
}

const pSBC = await Kernel.extensions.get("pSBC");

require("./ThemeLoader.js");

function isRoot() {
  // If we have permission level 0, we are effectively root

  return Kernel.accounts.getCurrentInfo().permLevel == 0;
}

if (!isRoot()) {
  input.stdout("ERROR: I'm not running as root! Cannot load kernel module, aborting.\n");
  return;
}

const handler = {
  themes: {
    getAllThemes: getAllThemes,
    getDefaultTheme: getDefaultTheme,

    getTheme: function(theme) {
      const themes = this.getAllThemes();
      const themesFilter = themes.find(i => i.DawnUI.name == theme);

      return themesFilter;
    }
  }
}

require("./UIGenerator/index.js")
handler.UIGenerator = UIGenerator;
handler.UIRules = UIRules;

Kernel.extensions.load("LibreDawn", handler);