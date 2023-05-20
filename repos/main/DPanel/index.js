const fs = await Kernel.extensions.get("Vfs");

const ws = await Kernel.extensions.get("WindowServer");
const dawn = await Kernel.extensions.get("LibreDawn");

const input = await Kernel.extensions.get("input");

const fb = Kernel.display.getFramebuffer(true);
const height = 30;

qb.require("./libs/renderCanvas.js");

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

const ui = dawn.UIGenerator;

// TODO: maybe move this?
renderCanvas(ws, input);

// TODO: remove this!
async function spawnTerminal() {
  const termApp = await fs.read("/bin/duskterm");
  const proc = Kernel.process.create(termApp.replace("UWU;;\n\n", ""));

  await Kernel.process.spawn("/bin/duskterm", proc, []);
}

spawnTerminal();

await ws.createWindow(winPos.y, winPos.x, winPos.width, height, async function(win) {
  // Init
  win.title = "DPanel//DoNotDisplay";

  // Main functions
  function createApplet(name, uuid) {
    const button = ui.input.buttonElem();
    button.style.width = "150px"; // Increase if needed...?
    button.innerText = name; // FIXME: Text is alligned but I don't want it to be for some reason

    button.addEventListener("click", () => ws.control.focus(uuid));

    return button;
  }

  // Init styles
  const main = fb.createElement("div");
  main.style.position = "absolute";
  main.style.width = "100%";
  main.style.height = "100%";
  
  main.style.backgroundColor = theme.styles["duskplus-config"].titlebar["background-color"];
  main.style.color = theme.styles.general.accents.white["background-color"];
  
  main.style.padding = "3px";

  const startButton = ui.input.buttonElem();
  startButton.innerText = "Menu";

  const nbspDoubleSpace = fb.createElement("span");
  nbspDoubleSpace.innerHTML = "&nbsp;&nbsp;";

  main.appendChild(startButton);
  main.appendChild(nbspDoubleSpace);

  const appsDiv = fb.createElement("div");
  appsDiv.style.overflow = "hidden";
  appsDiv.style.display = "inline";
  appsDiv.style.whiteSpace = "nowrap";

  main.appendChild(appsDiv);
  win.appendChild(main);

  // push the tempo
  let appList = [];

  while (true) {
    const winUUIDList = ws.fetch.getWindowUUIDList();
    const refreshPos = calcWinPos();

    win.style.top = refreshPos.y + "px";
    win.style.left = refreshPos.x + "px";
    win.style.width = refreshPos.width + "px";

    // INCREDIBLY HACKY and slow
    if (JSON.stringify(appList) != JSON.stringify(winUUIDList)) {
      appList = winUUIDList;
      appsDiv.innerHTML = "";

      for (const uuid of winUUIDList) {
        const name = ws.fetch.getWindowUUIDName(uuid);
        if (name == "DPanel//DoNotDisplay") continue;
        
        const applet = createApplet(name, uuid);

        const nbspSpace = fb.createElement("span");
        nbspSpace.innerHTML = "&nbsp;";

        appsDiv.appendChild(applet);
        appsDiv.appendChild(nbspSpace);
      }
    }

    await new Promise((i) => setTimeout(i, 50));
  }
}, {
  disableTemplate: true
});