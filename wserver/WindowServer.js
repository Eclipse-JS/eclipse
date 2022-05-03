// isStatic - window stays in place if true
// noBorder - no border if true
// FIXME: implement alwaysOnTop and alwaysOnBottom

// unfocused: z-index: 5;
// focused: z-index: 10;

kernel.fb.wmMode();
let fb = kernel.fb.getWMObject();

let windows = [];
let windowsTrackOf = [];

let focusedWindowUUID = "";
let mouseStats = { idUnder: "", isDown: false, which: 0, x: 0, y: 0 };

document.addEventListener('mousemove', e => {
  try {
    focusedWindowUUID = document.elementFromPoint(e.clientX, e.clientY).id; 
    mouseStats.idUnder = document.elementFromPoint(e.clientX, e.clientY).id;

    mouseStats.x = e.clientX;
    mouseStats.y = e.clientY;
  } catch (e) {
    //console.warn(e);
  }
}, {passive: true});

// Window movement
document.addEventListener("keydown", e => {
  if (e.key == "Control" && mouseStats.isDown && mouseStats.which == 1) {
    let isStatic = false;

    try {
      isStatic = windows.find(window => window.uuid == mouseStats.idUnder).config.isStatic;
    } catch (e) { }

    if (mouseStats.idUnder == "html-renderer" || isStatic) return;

    document.getElementById(mouseStats.idUnder).style.top = mouseStats.y - 120 + "px";
    document.getElementById(mouseStats.idUnder).style.left = mouseStats.x - 120 + "px";
  } else if (e.key == "Control" && mouseStats.isDown && mouseStats.which == 3) {
    /*
    let isStatic = false;

    try {
      isStatic = windows.find(window => window.uuid == mouseStats.idUnder).config.isStatic;
    } catch (e) { }

    if (mouseStats.idUnder == "html-renderer" || isStatic) return;

    document.getElementById(mouseStats.idUnder).style.width = parseInt(document.getElementById(mouseStats.idUnder).style.width) + mouseStats.y + "px";
    document.getElementById(mouseStats.idUnder).style.height = parseInt(document.getElementById(mouseStats.idUnder).style.height) + mouseStats.x + "px";
    */
  }
})

document.addEventListener("mousedown", e => {
  mouseStats.isDown = true;
  mouseStats.which = e.which;
});

document.addEventListener("mouseup", e => {
  mouseStats.isDown = false;
})

windowServer = {
  async newWindow(name, callback, Options) {
    let options = Options || {};

    let windowUUID = "";

    if (typeof options !== "undefined" && typeof options !== "object") {
      throw("Provided options are not an object");
    }

    // Crypto is not in some browsers (and only for https), so we try catch it
    try {
      windowUUID = crypto.randomUUID();

      for (i in windows) {
        if (windows[i].uuid == windowUUID) {
          windowUUID = crypto.randomUUID();
        }
      }
    } catch (e) {
      function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
      }

      windowUUID = getRandomInt(10000000, 99999999) + "-" + getRandomInt(1000, 9999) + "-" + getRandomInt(1000, 9999) + "-" + getRandomInt(1000, 9999) + "-" + getRandomInt(100000000000, 999999999999);

      for (i in windows) {
        if (windows[i].uuid == windowUUID) {
          windowUUID = windowUUID = getRandomInt(10000000, 99999999) + "-" + getRandomInt(1000, 9999) + "-" + getRandomInt(1000, 9999) + "-" + getRandomInt(1000, 9999) + "-" + getRandomInt(100000000000, 999999999999);
        }
      }
    }

    let windowElement = document.createElement("div");

    windowElement.className = "window";
    windowElement.id = windowUUID;

    if (!options.noBorder) windowElement.style.border = "1px solid #303d3d";
    windowElement.style.backgroundColor = "#1c1e1f";
    
    windowElement.style.position = "absolute";

    windowElement.style.top = "1px";
    windowElement.style.left = "1px";
    windowElement.style.width = "640px";
    windowElement.style.height = "360px";

    windowElement.style.color = "#ffffff";
    windowElement.style.fontFamily = "monospace";
    
    windowElement.style.overflow = "hidden";
    
    fb.appendChild(windowElement);

    windows.push({
      isActive: false,
      isFocused: false,
      windowTitle: name,
      uuid: windowUUID,
      options: options
    });

    windowsTrackOf.push(name);
    await kernel.pexec(name, callback, windowUUID);

    delete windowsTrackOf[windowsTrackOf.indexOf(name)];
    document.getElementById(windowUUID).remove();
    return;
  },
  setDesktopWallpaper(hex) {
    fb.style.backgroundColor = hex;
  },
  isFocused(uuid) {
    for (i of windows) {
      if (i.uuid == uuid && i.isFocused) return true;
    }

    return false;
  },
  getWinDetails(name) {
    if (windowsTrackOf.indexOf(name) == -1) {
      throw "Window does not exist";
    }

    return windows[windowsTrackOf.indexOf(name)];
  },
  setWindowTitle(name, title) {
    if (windowsTrackOf.indexOf(name) == -1) {
      throw "Window does not exist";
    }

    windows[windowsTrackOf.indexOf(name)].windowTitle = title;
  },
  async getKeyboardData(UUID) {
    while (!windowServer.isFocused(UUID)) {
      await sleep(30); 
    }

    let keyboardData = "";

    async function getKeyboardData(e) {
      if (e.key == "Enter") {
        keyboardData += "\n";
      } else if (e.key == "Meta" || e.key == "OS") {
        keyboardData += "Meta";
      } else if (e.key !== "Shift") {
        keyboardData += e.key;
      }
    }

    document.addEventListener("keydown", getKeyboardData);

    while (keyboardData == "") {
      await sleep(20);
    }

    document.removeEventListener("keydown", getKeyboardData);

    return keyboardData;
  }
};

while (true) {
  await sleep(100);

  for (i in windows) {
    if (windows[i].uuid == focusedWindowUUID) {
      windows[i].isFocused = true;
      document.getElementById(windows[i].uuid).style.zIndex = "10";
      if (!windows[i].options.noBorder) document.getElementById(windows[i].uuid).style.border = "1px solid #303d3d";
    } else {
      windows[i].isFocused = false;
      document.getElementById(windows[i].uuid).style.zIndex = "5";
      if (!windows[i].options.noBorder) document.getElementById(windows[i].uuid).style.border = "1px solid #141a1a";
    }
  }
}
