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

        outputDetails("WindowUpdate", oldFocusedUUID);
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

      let ctxID;

      const vdom = document.createElement("html");
      vdom.addEventListener = eventListener;

      vdom.createElement = function(item) {
        if (item == "script") return;
        return document.createElement(item);
      }

      vdom.selectActiveCanvasID = function(id) {
        if (!document.getElementById(id)) return false;
        if (typeof id != "string") return false;

        ctxID = id;
        return true;
      }

      async function mainLoop() {
        const ctx = item.fetchCanvas();

        // Synchronize width and height
        vdom.width =  ctx.width;
        vdom.height = ctx.height;

        // Draw canvas to screen
        if (!ctxID) return;
        if (!document.getElementById(ctxID) instanceof HTMLCanvasElement) return;

        const canvas = document.getElementById(ctxID);

        ctx.drawImage(canvas, 0, 0);
      }

      setInterval(mainLoop, 10);

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