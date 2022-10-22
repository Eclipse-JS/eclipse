qb.enableRegularRequire();

const args = argv;
const input = args.shift();

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

Kernel.extensions.load("LibDawn", handler);