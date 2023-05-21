qb.enableRegularRequire();

const elemCreate = document.createElement;

require("./FrameSecurity/createElementInject.js");
require("./FrameSecurity/createElementSecurity.js");
require("./FrameSecurity/elementSentry.js");

document.getElementById("framebuffer_v2").createElement = createElementSec;
document.createElement = createElementSec;

let localStorage = self.localStorage;

if (typeof BL_CMDLINE !== 'undefined') {
  localStorage = {
    getItem: function(key) {
      return self.localStorage.getItem(prefix + key);
    },
    setItem: function(key, value) {
      return self.localStorage.setItem(prefix + key, value);
    },
    removeItem: function(key) {
      return self.localStorage.removeItem(prefix + key);
    }
  }
}

function isBootloader() {
  return typeof BL_CMDLINE !== "undefined";
}

const extensions = [];

const processTree = [];
let processCount = 0;

require("./ErrorHandler/panic.js");

self.Kernel = {
  params: typeof localStorage["kernel_parameters"] == "string" ? localStorage["kernel_parameters"] : "",
  kernelLevel: {
    panic: panic,
    assert: assert,
  },
  extensions: {
    load(name, data, isGenFunction) {
      require("./Kernel/extensions/load.js");
    },
    async get(name, ...params) {
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
    getFramebuffer() {
      require("./Kernel/display/getFramebuffer.js");
    },
    size: {
      getWidth: () => window.innerWidth,
      getHeight: () => window.innerHeight
    }
  },
};

const klog = [
  {
    msg: "Kernel loaded.",
    time: Date.now()
  }
];

const klogfb = document.createElement("div");
klogfb.style.fontFamily = "monospace";
klogfb.style.fontSize = "14px";

const testfb = self.Kernel.display.getFramebuffer(true);
testfb.appendChild(klogfb);

function fillText(text, element) {
  element.innerHTML += text + "\n"
    .replaceAll("<", "&#60;")
    .replaceAll(">", "&#62;")
    .replaceAll("\n", "<br>")
    .replaceAll(" ", "&nbsp;");
}

self.Kernel.extensions.load("kprint", {
  log(str) {
    if (typeof str != "string" && typeof str != "number") panic("Unknown argument specified in kprint call", "Kernel::extension::kprint", new Error("kperr"));

    const loggedData = {
      msg: str,
      time: Date.now()
    };

    klog.push(loggedData);

    // Uncomment to enable console debugging.
    //console.log("[%s] %s", ((loggedData.time-klog[0].time)/1000).toFixed(3), loggedData.msg);

    const logMsg = `[${((loggedData.time-klog[0].time)/1000).toFixed(3)}] ${loggedData.msg}`
    fillText(logMsg, klogfb);

    document.body.scrollTo(0, document.body.scrollHeight);
  },

  error(str) {
    if (typeof str != "string" && typeof str != "number") panic("Unknown argument specified in kprint call", "Kernel::extension::kprint", new Error("kperr"));

    const loggedData = {
      msg: str,
      time: Date.now()
    };

    klog.push(loggedData);

    // Uncomment to enable console debugging.
    //console.log("[%s] %s", ((loggedData.time-klog[0].time)/1000).toFixed(3), loggedData.msg);

    const logMsg = `[${((loggedData.time-klog[0].time)/1000).toFixed(3)}] [!!ERROR/unknown_severe!!] ${loggedData.msg}`
    fillText(logMsg, klogfb);

    document.body.scrollTo(0, document.body.scrollHeight);
  },

  getLog: () => JSON.parse(JSON.stringify(klog)) // Since all objects are pointers, we don't want people polluting the kernel log directly.
});

async function loadExtras() {
  const kprint = await Kernel.extensions.get("kprint");

  if (localStorage.getItem("panic.log")) {
    kprint.log(`Recovering from panic!\n\n${localStorage.getItem("panic.log")}`);
  }

  kprint.log("Loading Sentry...");
  sentry();
}

loadExtras();