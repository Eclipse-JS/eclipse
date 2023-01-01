qb.enableRegularRequire();

const prefix = BL_CMDLINE ? BL_CMDLINE.split("fs_prefix='")[1].split("'")[0] : "";
const elemCreate = document.createElement;

require("./FrameSecurity/createElementInject.js");
require("./FrameSecurity/createElementSecurity.js");
require("./FrameSecurity/elementSentry.js");

document.getElementById("framebuffer_v2").createElement = createElementSec;
document.createElement = createElementSec;

const localStorage = {
  getItem: function(key) {
    return self.localStorage.getItem(prefix + key);
  },
  setItem: function(key, value) {
    self.localStorage.setItem(prefix + key, value);
  },
  removeItem: function(key) {
    self.localStorage.removeItem(prefix + key);
  }
}

if (localStorage.getItem("panic.log")) {
  console.error(`Recovering from panic!\n\n${localStorage.getItem("panic.log")}`);
}

const extensions = [];

const processTree = [];
let processCount = 0;

require("./ErrorHandler/panic.js");

console.log("Loading Sentry...");
sentry();

self.Kernel = {
  kernelLevel: {
    panic: panic,
    assert: assert,
  },
  extensions: {
    load: function (name, data, isGenFunction) {
      require("./Kernel/extensions/load.js");
    },
    get: function (name, ...params) {
      require("./Kernel/extensions/get.js");
    },
  },
  process: {
    create(funcStr) {
      const AsyncFunction = Object.getPrototypeOf(
        async function () {}
      ).constructor;

      return AsyncFunction("argv", "Kernel", "pid", "localStorage", funcStr);
    },
    async spawn(name, func, argv, kernel) {
      require("./Kernel/process/spawn.js");
    },
    getTree: () => processTree,
    getPID: () => processCount,
  },
  display: {
    getFramebuffer(futureMode) {
      if (futureMode) {
        require("./Kernel/display/getFramebuffer.js");

        return true;
      }

      console.warn(" !! WARNING !! - Framebuffer has been loaded in legacy mode!");
      require("./Kernel/display/getLegacyFramebuffer.js");
    },
  },
};
