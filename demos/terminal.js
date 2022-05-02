let Kernel = kernel;
let UUID = "";

if (!windowServer.newWindow) {
    kernel.stdout("WindowServer is not running.");
    return;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

let isKbdEnabled = false;
let stdout = "";
let vstd = "";

document.addEventListener("keydown", function (e) {
    if (isKbdEnabled && windowServer.isFocused(UUID)) {
      let bannedKbdKeys = [
        "Control",
        "Alt",
        "WakeUp",
        "Meta",
        "OS",
        "Page",
        "Arrow",
        "Shift",
        "Escape",
        "CapsLock",
        "Tab",
        "Home",
        "End",
        "Insert",
        "Delete",
        "Unidentified",
        "F1",
        "F2",
        "F0",
        "ContextMenu",
        "AudioVolumeDown",
        "AudioVolumeUp",
      ];
  
      if (e.key == "Enter") {
        isKbdEnabled = false;
        return;
      }
  
      if (e.key == "Backspace") {
        vstd = vstd.slice(0, -1);
        document.getElementById(UUID).innerHTML = sanitize(stdout + vstd).replaceAll("\n", "<br>").replaceAll(" ", "&nbsp;");
        document.getElementById(UUID).scrollTo(0, document.getElementById(UUID).scrollHeight);
        return;
      }
  
      for (kbd of bannedKbdKeys) {
        if (e.key.startsWith(kbd)) {
          return;
        }
      }
  
      vstd += e.key;
  
      document.getElementById(UUID).innerHTML = sanitize(stdout + vstd).replaceAll("\n", "<br>").replaceAll(" ", "&nbsp;");
      document.getElementById(UUID).scrollTo(0, document.getElementById(UUID).scrollHeight);
    }
});

await windowServer.newWindow("terminal", async function main(uuid) {
    UUID = uuid;
  
    let elem = document.getElementById(uuid);
    let kernel = Kernel;

    elem.innerHTML = sanitize(stdout).replaceAll("\n", "<br>").replaceAll(" ", "&nbsp;");
    elem.scrollTo(0, elem.scrollHeight);

    kernel.stdout = function (...args) {
        let argv = args.join(" ");

        if (argv == "jsKernelReq$cls") {
            elem.innerText = "";
            stdout = "";
            return;
        }

        stdout += argv;

        elem.innerHTML = sanitize(stdout).replaceAll("\n", "<br>").replaceAll(" ", "&nbsp;");
        elem.scrollTo(0, elem.scrollHeight);
    }
    
    kernel.stdin = async function () {
      isKbdEnabled = true;

      while (isKbdEnabled) {
        await sleep(100);
      }

      let vsh = vstd;
      vstd = "";

      kernel.stdout(vsh, "\n");

      return vsh;
    }

    for (i of Applications) {
        if (i.name == "btm.sh") {
            await kernel.pexec(i.name, i.function, []);
        }
    }

    while (true) {
        await sleep(100);
    }
});