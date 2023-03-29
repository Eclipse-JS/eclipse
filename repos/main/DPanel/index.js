const ws = await Kernel.extensions.get("WindowServer");
const dawn = await Kernel.extensions.get("LibreDawn");

const fb = Kernel.display.getFramebuffer(true);

const height = 30;

function calcWinPos() {
  const fbWidth = Kernel.display.size.getWidth();
  const fbHeight = Kernel.display.size.getHeight();

  const y = fbHeight - height;
  
  return {
    width: fbWidth,

    x: 0,
    y
  }
}

const winPos = calcWinPos();
const theme = dawn.themes.getTheme(dawn.themes.getDefaultTheme());

await ws.createWindow(winPos.y, winPos.x, winPos.width, height, async function(win) {
  // Init styles
  const ui = dawn.UIGenerator;
  
  const main = fb.createElement("div");
  main.style.position = "absolute";
  main.style.width = "100%";
  main.style.height = "100%";
  main.style.backgroundColor = theme.styles["duskplus-config"].titlebar["background-color"];
  main.style.color = theme.styles.general.accents.white["background-color"];
  main.style.padding = "3px";

  const startButton = ui.input.buttonElem();
  startButton.innerText = "Menu";

  const nbspDoubleSpace = document.createElement("span");
  nbspDoubleSpace.innerHTML = "&nbsp;&nbsp;";

  main.appendChild(startButton);
  main.appendChild(nbspDoubleSpace);

  const appsDiv = document.createElement("div");
  appsDiv.style.overflow = "hidden";
  
  main.appendChild(appsDiv);
  win.appendChild(main);

  while (true) {
    const refresh = calcWinPos();

    win.style.top = refresh.y + "px";
    win.style.left = refresh.x + "px";
    win.style.width = refresh.width + "px";

    await new Promise((i) => setTimeout(i, 100));
  }
}, {
  disableTemplate: true
});