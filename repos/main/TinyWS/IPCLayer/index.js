qb.enableRegularRequire();

return {
  hasWMStarted: hasWMStarted,
  registerWM: function(name, outputWrapper) {
    if (this.hasWMStarted) {
      throw new Error("Window Manager already registered!");
    }

    function inputWrapper(input) {
      require("./inputWrapper.js");
    }

    wmConf.name = name;
    wmConf.outputWrapper = outputWrapper;

    hasWMStarted = true;
    this.hasWMStarted = true;

    return inputWrapper;
  },
  async createWindow(width, height, callback) {
    if (!this.hasWMStarted) {
      throw new Error("Window Manager not registered yet!");
    }

    const canvas = generateCanvas(width, height);
    canvas.style.top = "300px";
    canvas.style.left = "300px";

    // We use a custom uuid implementation because crypto is only on HTTPS. :(

    const item = {
      uuid: uuidv4(),
      fetchCanvas: () => canvas
    };

    windows.push(item);

    // Needed for when we implement titlebars
    const resp = wmConf.outputWrapper({
      event: "WindowCreate",
      uuid: item.uuid,
    });

    try {
      await callback(item.fetchCanvas());
    } catch (e) {
      console.error(e);
    }

    windows.splice(windows.indexOf(item), 1);
    
    wmConf.outputWrapper({
      event: "WindowClose",
      uuid: item.uuid
    });
  }
};