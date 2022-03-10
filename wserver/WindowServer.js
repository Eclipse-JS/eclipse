kernel.fb.fbMode();
let fb = kernel.fb.getFB();

let windows = [];
let windowsTrackOf = [];

// #303d3d - for window borders
// #1c1e1f - for desktop background

windowServer = {
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

windowServer.setDesktopWallpaper('#292c2e');