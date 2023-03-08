qb.enableRegularRequire();

function getAllThemes() {
  const themes = [require("./Themes/groovy.dawn.json"),
                  require("./Themes/arcticice.dawn.json"),
                  require("./Themes/eleven.dawn.json")];

  return themes;
}

function getDefaultTheme() {
  return VFS.existsSync("/etc/sonnesvr/dawn/theme", "folder") ? VFS.read("/etc/dawn.d/theme") : "Arctic Ice";
}