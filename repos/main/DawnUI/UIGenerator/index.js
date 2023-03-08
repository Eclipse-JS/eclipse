function getStyle() {
  return handler.themes.getTheme(handler.themes.getDefaultTheme());
}

const UIRules = {
  genericInput: function applyRulesGenericInput(elem) {
    const style = getStyle().styles;
    this.genericColors(elem);

    elem.style.borderColor = style.general.background["foreground-color"];
    elem.style.borderRadius = "0px";
  },
  genericColors: function applyRulesGenericAll(elem) {
    const style = getStyle().styles;

    elem.style.backgroundColor = style.general.background["background-color"];
    elem.style.color = style.general.accents.white["background-color"];

    return elem;
  }
}

const UIGenerator = {
  input: {
    buttonElem: function() {
      const elem = document.createElement("button");
      UIRules.genericInput(elem);

      return elem;
    },
    inputElem: function() { // TODO: Fix checkbox (https://www.w3schools.com/howto/howto_css_custom_checkbox.asp)
      const elem = document.createElement("input");
      UIRules.genericInput(elem);

      return elem;
    }
  }
}