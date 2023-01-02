function convertCSSStyleToJS(item) {
  if (item.endsWith("px")) {
    return parseFloat(item.replace("px", ""));
  }

  return;
}