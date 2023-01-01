function duskCallback(e) {
  if (e.event == "WindowUpdate") {
    const widthAndHeight = e.details.fetchWindowSize().wh;
    const title = e.details.fetchWindowTitle();

    const focusedUUID = wmData.inputWrapper({
      event: "FetchFocusedUUID"
    })
    
    const isFocused = e.uuid == focusedUUID;

    const genCanvas = wmData.inputWrapper({
      event: "FetchRequest",
      subevent: "genCanvas"
    });

    const height = 27;

    const canvas = genCanvas(widthAndHeight[0]+height, height);
    const ctx = canvas.getContext("2d");

    const theme = ui.themes.getTheme(ui.themes.getDefaultTheme());

    ctx.fillStyle = theme.styles.general.background["background-color"];
    ctx.fillRect(0, 0, widthAndHeight[0], height);

    const color = isFocused ? "background-color" : "foreground-color";

    ctx.fillStyle = theme.styles.general.accents.white[color];
    ctx.font = '15px system-ui';
    ctx.fillText(title ? title : "Window", 4, height-8);

    return canvas;
  }
}