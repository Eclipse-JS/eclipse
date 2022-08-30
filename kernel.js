function mask() {
  let Document = {};

  Document.getElementById = document.getElementById;
  Document.getElementById = document.getElementById;
  Document.getElementsByClassName = document.getElementsByClassName;
  Document.getElementsByTagName = document.getElementsByTagName;
  Document.getElementsByTagNameNS = document.getElementsByTagNameNS;
  Document.appendChild = document.appendChild;
  Document.append = document.append;

  document.getElementById = null;
  document.getElementsByClassName = null;
  document.getElementsByTagName = null;
  document.getElementsByTagNameNS = null;
  document.append = null;
  document.appendChild = null;

  return Document;
}

function generateFakeDocument(mask) {
  let newMask = {};

  for (const i of Object.keys(mask)) {
    newMask[i] = function(...args) {
      document[i] = mask[i];
      const data = document[i](...args);
      document[i] = null;

      return data;
    }
  }

  return newMask;
}

{
  const extensions = [];

  const processTree = [];
  let processCount = 0;

  const documentMask = mask();
  const document = generateFakeDocument(documentMask);

  function panic(error, atLocation, trace) {
    console.error("panic! nocpu");
    console.error(`  ${error} @ ${atLocation}`);
    console.error(`  Rebooting in 5 seconds...`);

    if (trace) console.error("  Error:", trace);

    setTimeout(function() {
      //window.location.reload()
    }, 5000);
  }

  Kernel = {
    extensions: {
      load: function(name, rawData, isGenFunction) {
        const find = extensions.find(val => val.name == name);
        
        if (typeof find == "object" && find.length != 0) {
          throw "Extension already loaded!";
        }

        const data = isGenFunction ? rawData() : rawData;

        extensions.push({
          name: name,
          data: data
        })
      },
      get: function(name) {
        if (extensions.find(val => val.name == name).length == 0) {
          throw "Extension not loaded!";
        }

        return extensions.find(val => val.name == name).data;
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
        if (!document.getElementById("framebuffer")) {
          panic("No framebuffer. wtf?", "KernelSpace::display::getFrameBuffer")
        }

        if (document.getElementById("framebuffer").width != screen.availWidth || document.getElementById("framebuffer").height != screen.availHeight) {
          document.getElementById("framebuffer").width = window.innerWidth;
          document.getElementById("framebuffer").height = window.innerHeight;
        }

        return document.getElementById("framebuffer").getContext("2d");
      }
    }
  }
}