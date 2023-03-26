qb.enableRegularRequire();

function getStyle() {
  return handler.themes.getTheme(handler.themes.getDefaultTheme());
}

require("./pSBC.js");

const UIRules = {
  genericInput: function applyRulesGenericInput(element) {
    const style = getStyle().styles;
    const elem = this.genericColors(element);

    elem.style.borderColor = style.general.background["foreground-color"];
    elem.style.borderStyle = "solid";
    elem.style.borderWidth = "3px";
    elem.style.borderRadius = "0px";

    return elem;
  },
  genericColors: function applyRulesGenericAll(elem) {
    const style = getStyle().styles;

    elem.style.backgroundColor = style.general.background["background-color"];
    elem.style.color = style.general.accents.white["background-color"];
    elem.style.outline = "0";

    return elem;
  },
  genericPadding: function applyRulesPadding(elem) {
    elem.style.padding = "5px";
  }
}

const UIGenerator = {
  input: {
    buttonElem: function() {
      const style = getStyle().styles;
      
      const element = document.createElement("button");
      const elem = UIRules.genericInput(element);

      elem.addEventListener("mousedown", function() {
        elem.style.borderColor = pSBC(-0.25, style.general.background["foreground-color"]);
      });
  
      elem.addEventListener("mouseup", function() {
        elem.style.borderColor = style.general.background["foreground-color"];
      });

      return elem;
    },
    inputElem: function() { // TODO: Fix checkbox (https://www.w3schools.com/howto/howto_css_custom_checkbox.asp)
      const elem = document.createElement("input");
      UIRules.genericInput(elem);

      return elem;
    }
  }
}