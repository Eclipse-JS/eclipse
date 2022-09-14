qb.enableRegularRequire();

require("./eventProxy.js");

function outputDetails(event, item) {
  return wmConf.outputWrapper({
    event: event,
    uuid: item.uuid,
    details: {
      fetchWindowSize: () => {
        const fetchedItem = item.fetchCanvas();

        return {
          xy: [fetchedItem.style.top, fetchedItem.style.left],
          wh: [fetchedItem.width, fetchedItem.height]
        }
      },
      fetchWindowTitle: () => item.fetchCanvas().title
    }
  });
}

return {
  hasWMStarted: hasWMStarted,
  registerWM: function(name, outputWrapper) {
    if (this.hasWMStarted) {
      throw new Error("Window Manager already registered!");
    }

    return {
      loadWM: function(callback) {
        wmConf.name = name;
        wmConf.outputWrapper = callback;
    
        hasWMStarted = true;
        this.hasWMStarted = true;    
      },
      inputWrapper: function inputWrapper(input) {
        require("./inputWrapper.js");
      }
    }
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

    // Needed for when we implement titlebars
    outputDetails("WindowCreate", item);

    const resp = outputDetails("WindowUpdate", item);

    if (resp instanceof HTMLCanvasElement) {
      item.outerCanvas = resp;
    }

    windows.push(item);

    function update() {
      const window = windows[windows.indexOf(item)];
      
      const newCanvas = outputDetails("WindowUpdate", item);

      if (newCanvas instanceof HTMLCanvasElement) {
        window.outerCanvas = newCanvas;
      }
      
      windows.splice(windows.indexOf(item), 1, window);
    }

    try {
      await callback(item.fetchCanvas(), update, returnEvt(item.uuid));
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