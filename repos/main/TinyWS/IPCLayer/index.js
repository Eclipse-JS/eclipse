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
  async createWindow(width, height, callback, options) {
    const parsedOptions = typeof options == "object" ? options : {};

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

    if (!parsedOptions.disableFocus) {
      if (focusedUUID) {
        const oldWindow = windows.find(i => i.uuid == focusedUUID);
        focusedUUID = item.uuid;

        outputDetails("WindowUpdate", oldWindow);
      } else {
        focusedUUID = item.uuid;
      }
    }

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
      const eventListener = returnEvt(item.uuid);

      // Virtual DOM - May be needed for porting applications?
      // Adds a way to proxy stuff through an element, and the active canvas can easily be switched

      const vdom = document.createElement("html");

      vdom.addEventListener = eventListener;
    
      // I hate HTML.
      // I have to make a custom implementation because it doesn't expose a way to do this via createElement (afaik)

      vdom.getElementById = function(id) {
        const elements = vdom.getElementsByTagName("*");

        // Array.prototype.find doesn't work on HTML Arrays. wtf?
        for (const i of elements) {
          if (i.id == id) return i;
        }

        return undefined;
      };

      vdom.createElement = function(item) {
        if (item == "script") return;
        return document.createElement(item);
      }

      await callback(item.fetchCanvas(), update, eventListener, vdom);
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