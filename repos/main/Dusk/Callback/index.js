function duskCallback(e) {
  if (e.event == "WindowCreate") {
    const widthAndHeight = e.details.fetchWindowSize().wh;
    const title = e.details.fetchWindowTitle();

    windows.push({
      uuid: e.uuid,
      wh: widthAndHeight
    })
  } else if (e.event == "WindowUpdate") {
    const widthAndHeight = e.details.fetchWindowSize().wh;
    const title = e.details.fetchWindowTitle();

    windows.push({
      uuid: e.uuid,
      wh: widthAndHeight
    })

    const genCanvas = wmData.inputWrapper({
      event: "FetchRequest",
      subevent: "genCanvas"
    });

    const height = 27;

    const canvas = genCanvas(widthAndHeight[0]+height, height);
    const ctx = canvas.getContext("2d");

    const theme = ui.themes.getTheme(ui.themes.getDefaultTheme());

    ctx.fillStyle = theme.styles.general.background["background-color"];
    console.log(0, 0, widthAndHeight[0], height);
    
    ctx.fillRect(0, 0, widthAndHeight[0], height);

    ctx.fillStyle = theme.styles.general.accents.white["background-color"];
    ctx.font = '15px system-ui';
    ctx.fillText(title ? title : "Window", 4, height-8);

    return canvas;
  } else if (e.event == "WindowClose") {
    windows.slice(windows.indexOf(windows.find(i => i.uuid == e.uuid)));
  }
}