kernel.fb.fbMode();
let fb = kernel.fb.getFB();

let windows = [];
let windowsTrackOf = [];

let windowServer = {
  async newWindow(name, callback) {
    windows.push({
      "isActive": false,
      "windowTitle": name
    })

    windowsTrackOf.push(name);
    await kernel.pexec(name, callback, [name]);

    delete windowsTrackOf[windowsTrackOf.indexOf(name)];
    return;
  },
  setDesktopWallpaper(hex) {
    fb.fillStyle = hex;
    fb.fillRect(0, 0, screen.width, screen.height);
  },
  getWinID(name) {
    if (windowsTrackOf.indexOf(name) == -1) {
      return null;
    }

    return windowsTrackOf.indexOf(name);
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
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function rgbToHex(r, g, b) {
  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

while (true) {
  windowServer.setDesktopWallpaper(rgbToHex(getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)));
  await sleep(1);
}   