qb.enableRegularRequire();

function getAllThemes() {
  const themes = [require("./Themes/groovy.dawn.json"),
                  require("./Themes/arcticice.dawn.json")];

  return themes;
}

function getDefaultTheme() {
  return VFS.existsSync("/etc/dawn.d/theme", "folder") ? VFS.read("/etc/dawn.d/theme") : "Arctic Ice";
}