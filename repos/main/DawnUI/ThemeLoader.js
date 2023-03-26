qb.enableRegularRequire();

function getAllThemes() {
  const themes = [
    require("./Themes/groovy.dawn.json"),
    require("./Themes/arcticice.dawn.json"),
    require("./Themes/eleven.dawn.json")
  ];

  return themes;
}

function getDefaultTheme() {
  return "Eleven (Light)"; // TODO!
}