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
      window.location.reload()
    }, 5000);
  }

  Kernel = {
    process: {
      create(funcStr) {
        const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

        return AsyncFunction(funcStr);
      },
      async spawn(name, func) {
        const pid = processCount;

        processTree.push({
          name: name,
          id: pid
        })

        processCount++;

        try {
          await func();
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