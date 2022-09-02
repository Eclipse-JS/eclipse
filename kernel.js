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
        const find = extensions.find(val => val.name == name);
        
        if (typeof find == "object" && find.length != 0) {
          throw "Extension already loaded!";
        }

        extensions.push({
          name: name,
          data: data,
          isGenFunction: isGenFunction ? true : false
        })
      },
      get: function(name, ...params) {
        if (extensions.find(val => val.name == name).length == 0) {
          throw "Extension not loaded!";
        }

        const extFind = extensions.find(val => val.name == name);

        if (extFind.isGenFunction) {
          const data = extFind.data(...params);
          return data;
        } else {
          return extFind.data;
        }
      }
    },
    process: {
      create(funcStr) {
        const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

        return AsyncFunction("argv", "Kernel", funcStr);
      },
      async spawn(name, func, argv, kernel) {
        const pid = processCount;

        processTree.push({
          name: name,
          id: pid
        })

        processCount++;

        try {
          await func(argv, typeof kernel == "object" ? kernel : Kernel);
        } catch (e) {
          if (pid == 0) {
            panic("Attempted to kill init!", "Userspace Process: " + name, e);
          } else {
            console.error(e);
          }
        }

        delete processTree[processTree.indexOf({name: name, id: pid})];

        if (pid == 0) {
          panic("Attempted to kill init!", "KernelSpace")
        }
      }
    },
    display: {
      getFramebuffer() {
        assert(document.getElementById("framebuffer"), "No framebuffer detected!");

        if (document.getElementById("framebuffer").width != screen.availWidth || document.getElementById("framebuffer").height != screen.availHeight) {
          document.getElementById("framebuffer").width = window.innerWidth;
          document.getElementById("framebuffer").height = window.innerHeight;
        }

        return document.getElementById("framebuffer").getContext("2d");
      }
    }
  }
}