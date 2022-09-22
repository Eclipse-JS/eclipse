qb.enableRegularRequire();

if (localStorage["panic.log"]) {
  console.error(`Recovering from panic!\n\n${localStorage["panic.log"]}`);
}

const extensions = [];

const processTree = [];
let processCount = 0;

function panic(error, atLocation, trace) {
  let file = `panic! nocpu!\n  ${error} @ ${atLocation}\n`;

  if (trace) file += "  Error:" + trace;

  file +=
    "\n\nPlease report this panic to https://github.com/Eclipse-JS/eclipse!";

  localStorage.setItem("panic.log", file);

  window.location.reload();
}

function assert(test, msg) {
  if (!test) panic("Assertion failed!! " + msg, "KernelSpace::Anonymous");
}

self.Kernel = {
  kernelLevel: {
    panic: panic,
    assert: assert,
  },
  extensions: {
    load: function (name, data, isGenFunction) {
      require("./extensions/load.js");
    },
    get: function (name, ...params) {
      require("./extensions/get.js");
    },
  },
  process: {
    create(funcStr) {
      const AsyncFunction = Object.getPrototypeOf(
        async function () {}
      ).constructor;

      return AsyncFunction("argv", "Kernel", "pid", funcStr);
    },
    async spawn(name, func, argv, kernel) {
      require("./process/spawn.js");
    },
    getTree: () => processTree,
    getPID: () => processCount,
  },
  display: {
    getFramebuffer() {
      require("./display/getFramebuffer.js");
    },
  },
};
