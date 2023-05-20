qb.enableRegularRequire();

require("./Utilities/OutputDetails.js");
require("./Utilities/InputWrapper.js");
require("./Utilities/DisabledTemplate.js");

return {
  hasWMStarted: hasWindowManagerRegistered,
  registerWM(name) {
    if (hasWindowManagerRegistered)
      throw new Error("Window Manager already registered!");

    wmConf.name = name;

    hasWindowManagerRegistered = true;
    this.hasWMStarted = true;

    return {
      outputWrapper: (outputWrapper) => (wmConf.outputWrapper = outputWrapper),
      inputWrapper: inputWrapper,
    };
  },
  async createWindow(x, y, width, height, callback, options = {}) {
    if (!hasWindowManagerRegistered)
      throw new Error("Window Manager not registered yet!");
    const id = uuidv4();

    outputDetails("WindowCreate", id, x, y, width, height);
    const resp = options.disableTemplate
      ? createFakeWin(x, y, width, height)
      : outputDetails("WindowUpdate", id, x, y, width, height);

    const overlay = resp;

    if (!(overlay instanceof HTMLDivElement)) {
      throw new Error(
        "The window manager has failed to supply a window template!"
      );
    }

    const mainElement = framebuffer.createElement("div");
    mainElement.className = id;
    mainElement.title = "Window";

    overlay.getElementsByClassName("container")[0].appendChild(mainElement);
    overlay.className = `${id}_overlay`;

    wsData.appendChild(overlay);

    function updated() {
      if (!wsData.contains(mainElement)) return;

      if (
        mainElement.style.top != "" &&
        mainElement.style.top != overlay.style.top
      ) {
        overlay.style.top = mainElement.style.top;
      }

      if (
        mainElement.style.left != "" &&
        mainElement.style.left != overlay.style.left
      ) {
        overlay.style.left = mainElement.style.left;
      }

      if (
        mainElement.style.width != "" &&
        mainElement.style.width != overlay.style.width
      ) {
        overlay.style.width = mainElement.style.width;
      }

      if (
        mainElement.style.height != "" &&
        mainElement.style.height != overlay.style.height
      ) {
        overlay.style.height = mainElement.style.height;
      }

      overlay.getElementsByClassName("title")[0].innerText = mainElement.title;

      setTimeout(updated, 50);
    }

    updated();
    const eventListeners = returnEvt(id);

    if (focusedUUID) {
      const window = wsData.getElementsByClassName(focusedUUID + "_overlay")[0];

      if (window) {
        window.style.zIndex = 12;
      }
    }

    focusedUUID = id;

    try {
      await callback(
        mainElement,
        eventListeners.addEventListener,
        eventListeners.removeEventListener
      );
    } catch (e) {
      console.error(e);
    }

    outputDetails("WindowClose", id, x, y, width, height);
    if (focusedUUID == id) focusedUUID = null;

    mainElement.remove();
    overlay.remove();
  },

  setBackground(element) {
    // I can't think of a way to validate the element, and I'm lazy.
    background.innerHTML = "";
    background.appendChild(element);

    return true;
  },

  fetch: {
    getWindowUUIDList() {
      const res = [];

      for (const i of wsData.children) {
        if (!i.className) continue;

        res.push(i.className);
      }

      return res.map((i) => i.replace("_overlay", ""));
    },
    getWindowUUIDName(uuid) {
      const elem = wsData.getElementsByClassName(uuid + "_overlay");
      if (!elem) throw new Error("Failed to find the Window UUID.");

      return elem[0].getElementsByClassName("title")[0].innerText;
    }
  },

  control: {
    focus(uuid) {
      if (!uuid) throw new Error("UUID not specified!")

      const window = wsData.getElementsByClassName(uuid + "_overlay")[0];
      if (!window) throw new Error("Window does not exist!");

      if (focusedUUID) {
        const window = wsData.getElementsByClassName(focusedUUID + "_overlay")[0];

        if (window) {
          window.style.zIndex = 12;
        }
      }

      window.style.zIndex = 13;
      focusedUUID = uuid;

      return true;
    }
  }
};
