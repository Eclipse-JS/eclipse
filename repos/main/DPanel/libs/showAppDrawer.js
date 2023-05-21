// pSBC strikes again!
qb.require("./pSBC.js");

let isAppDrawerRunning = false;

async function showAppDrawer(desktopEntries) {
  if (isAppDrawerRunning) {
    isAppDrawerRunning = false;
    return;
  } else {
    isAppDrawerRunning = true;
  }

  const winWidth = 200;
  const winHeight = 300;

  function createAppDrawerApplet(name, functionData) {
    const div = fb.createElement("div");
    div.style.width = "100%";
    div.style.padding = "2px";

    const span = fb.createElement("span");
    span.innerText = name;

    div.appendChild(span);

    div.addEventListener("mouseover", () => {
      div.style.backgroundColor = pSBC(-0.25, theme.styles["duskplus-config"].titlebar["background-color"]);
    });

    div.addEventListener("mouseout", () => {
      div.style.backgroundColor = theme.styles["duskplus-config"].titlebar["background-color"];
    });

    div.addEventListener("click", async(e) => {
      await functionData(e);
    });

    return div;
  }

  await ws.createWindow(winPos.y-winHeight, winPos.x, winWidth, winHeight, function(win) {
    return new Promise(async(resolve) => {
      win.title = "DPanel-AppDrawer";

      win.style.backgroundColor = theme.styles["duskplus-config"].titlebar["background-color"];
      win.style.color = theme.styles.general.accents.white["background-color"];

      const mainDiv = fb.createElement("div");
      mainDiv.style.width = "100%";
      mainDiv.style.height = "100%";

      win.appendChild(mainDiv);

      for (const desktopEntry of desktopEntries) {
        mainDiv.appendChild(createAppDrawerApplet(desktopEntry.name, () => {
          exec(desktopEntry.path, []);
          isAppDrawerRunning = false;

          resolve();
        }));
      }
    
      while (true) {
        // I tried while(isAppRunning), but it didn't work for some reason...?
        if (!isAppDrawerRunning) return resolve();

        await new Promise((i) => setTimeout(i, 100));
      }
    });
  }, {
    disableTemplate: true
  });
}