qb.enableRegularRequire();

function outputDetails(event, uuid, x, y, w, h) {
  return wmConf.outputWrapper({
    event: event,
    uuid: uuid,
    details: {
      fetchWindowSize: () => {
        return {
          xy: [x, y],
          wh: [w, h]
        }
      }
    }
  });
}

return {
  hasWMStarted: hasWindowManagerRegistered,
  registerWM(name, outputWrapper) {
    if (hasWindowManagerRegistered) throw new Error("Window Manager already registered!");

    wmConf.name = name;
    wmConf.outputWrapper = outputWrapper;

    hasWindowManagerRegistered = true;
    this.hasWMStarted = true; 

    // Input wrapper
    return function(input) {

    }
  },
  async createWindow(x, y, width, height, callback, options = {}) {
    if (!hasWindowManagerRegistered) throw new Error("Window Manager not registered yet!");
    const id = uuidv4();

    outputDetails("WindowCreate", id, x, y, width, height);
    const resp = outputDetails("WindowUpdate", id, x, y, width, height);

    const overlay = resp;
    
    if (!(overlay instanceof HTMLDivElement)) {
      throw new Error("WindowManager has failed to supply a window template!");
    }

    const mainElement = framebuffer.createElement("div");
    mainElement.className = id;
    mainElement.title = "Window";

    overlay.getElementsByClassName("container")[0].appendChild(mainElement);
    overlay.className = `${id}_overlay`;

    wsData.appendChild(overlay);

    function updated() {
      if (!wsData.contains(mainElement)) return;
      
      if (mainElement.style.top != "" && mainElement.style.top != overlay.style.top) {
        overlay.style.top = mainElement.style.top;
      }

      if (mainElement.style.left != "" && mainElement.style.left != overlay.style.left) {
        overlay.style.left = mainElement.style.left;
      }

      if (mainElement.style.width != "" && mainElement.style.width != overlay.style.width) {
        overlay.style.width = mainElement.style.width;
      }
      
      if (mainElement.style.height != "" && mainElement.style.height != overlay.style.height) {
        overlay.style.height = mainElement.style.height;
      }

      overlay.getElementsByClassName("title")[0].innerText = mainElement.title;

      setTimeout(updated, 50);
    }

    updated();

    try {
      await callback(mainElement);
    } catch (e) {
      console.error(e);
    }

    outputDetails("WindowClose", id, x, y, width, height);
   
    mainElement.remove();
    overlay.remove();
  }
}