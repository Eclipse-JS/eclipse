function redraw(textData) {
  fbTTYData.innerHTML = textData
    .replaceAll("<", "&#60;")
    .replaceAll(">", "&#62;")
    .replaceAll("\n", "<br>")
    .replaceAll(" ", "&nbsp;");
}
