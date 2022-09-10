qb.enableRegularRequire();

const args = argv;
const input = args.shift();

require("./ThemeLoader.js");

function isRoot() {
  // If we have permission level 0, we are effectively root

  return Kernel.accounts.getCurrentInfo().permLevel == 0;
}

if (!isRoot()) {
  input.stdout("ERROR: I'm not running as root! Cannot load kernel module, aborting.\n");
  return;
}

Kernel.extensions.load("LibDawn", {
  themes: {
    getAllThemes: function() {
      return getAllThemes();
    },
    getTheme: function(theme) {
      const themes = this.getAllThemes();
      const themesFilter = themes.find(i => i.DawnUI.name == theme);

      return themesFilter;
    },
    getDefaultTheme: () => getDefaultTheme()
  }
})