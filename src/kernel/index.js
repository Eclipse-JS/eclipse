qb.enableRegularRequire();

{
  const extensions = [];

  const processTree = [];
  let processCount = 0;

  function panic(error, atLocation, trace) {
    console.error("panic! nocpu");
    console.error(`  ${error} @ ${atLocation}`);
    console.error(`  Rebooting in 5 seconds...`);

    if (trace) console.error("  Error:", trace);

    setTimeout(function() {
      window.location.reload()
    }, 5000);
  }

  function assert(test, msg) {
    if (!test) panic("Assertion failed!! " + msg, "KernelSpace::Anonymous");
  }

  Kernel = {
    extensions: {
      load: function(name, data, isGenFunction) {
        require("./extensions/load.js")
      },
      get: function(name, ...params) {
        require("./extensions/get.js")
      }
    },
    process: {
      create(funcStr) {
        const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

        return AsyncFunction("argv", "Kernel", "pid", funcStr);
      },
      async spawn(name, func, argv, kernel) {
        require("./process/spawn.js")
      },
      getTree: () => processTree,
      getPID: () => processCount
    },
    display: {
      getFramebuffer() {
        require("./display/getFramebuffer.js")
      }
    }
  }
}