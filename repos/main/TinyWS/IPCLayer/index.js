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

    const stockOverlay = framebuffer.createElement("div");
    stockOverlay.style.position = "absolute";
    stockOverlay.style.top = x + "px";
    stockOverlay.style.left = y + "px";
    stockOverlay.style.width = width + "px";
    stockOverlay.style.height = height + "px";
    stockOverlay.style.overflow = "hidden";

    const mainElement = framebuffer.createElement("div");
    mainElement.className = id;
    mainElement.title = "Window";
    
    outputDetails("WindowCreate", id, x, y, width, height);
    const resp = outputDetails("WindowUpdate", id, x, y, width, height);

    let overlay = stockOverlay;

    if (resp instanceof HTMLDivElement) {
      overlay = resp;
    } else {
      const titleElem = framebuffer.createElement("span");
      titleElem.className = "title";

      titleElem.style.fontFamily = "monospace";
      titleElem.style.fontSize = "14px";
      titleElem.style.fontWeight = "bold";

      titleElem.style.color = "#000000";

      titleElem.style.position = "absolute";
      titleElem.style.top = "0px";
      titleElem.style.left = "0px";
      titleElem.style.width = width + "px";
      titleElem.style.height = height + "px";

      const containerElem = framebuffer.createElement("div");
      containerElem.className = "container";
      
      containerElem.style.backgroundColor = "#ffffff";

      overlay.appendChild(titleElem);
      overlay.appendChild(containerElem);
    }

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