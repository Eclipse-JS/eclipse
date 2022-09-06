return {
  hasWMStarted: hasWMStarted,
  registerWM: function(name, outputWrapper) {
    if (this.hasWMStarted) {
      throw new Error("Window Manager already registered!");
    }

    function inputWrapper(input) {
      require("./WindowManagerIPC/inputWrapper.js");
    }

    wmConf.name = name;
    wmConf.outputWrapper = outputWrapper;

    return inputWrapper;
  },
  createWindow(width, height, callback) {
    if (!this.hasWMStarted) {
      throw new Error("Window Manager not registered yet!");
    }

    const canvas = generateCanvas(width, height);
    canvas.style.top = "300px";
    canvas.style.left = "300px";

    const item = {
      uuid: crypto.randomUUID(),
      fetchCanvas: () => canvas
    };

    windows.push(item);

    // Needed for when we implement titlebars
    const resp = wmConf.outputWrapper({
      event: "WindowCreate",
      uuid: uuid,
    });

    try {
      callback(item.canvas);
    } catch (e) {
      console.error(e);
    }

    windows.splice(windows.indexOf(item), 1);
    
    wmConf.outputWrapper({
      event: "WindowClose",
      uuid: uuid
    });
  }
};