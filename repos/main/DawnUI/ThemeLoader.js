qb.enableRegularRequire();

function getAllThemes() {
  const themes = [require("./Themes/groovy.dawn.json")];

  return themes;
}

function getDefaultTheme() {
  return "Groovy";
}