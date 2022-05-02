let Kernel = kernel;

if (!windowServer.newWindow) {
    kernel.stdout("WindowServer is not running.");
    return;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

let stdout = "";

/*
let isKbdEnabled = false;
let stdout = "";
let stdoutHTMl = "";

let vstd = "";

document.addEventListener("keydown", function (e) {
    if (isKbdEnabled) {
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
  
      if (isCtrl && e.keyCode == "67") {
        return;
      }
  
      if (isCtrl && e.keyCode == "86") {
        return;
      }
  
      if (e.key == "Enter") {
        isKbdEnabled = false;
        return;
      }
  
      if (e.key == "Backspace") {
        vstd = vstd.slice(0, -1);
        stdoutHTML = sanitize(stdout + vstd).replaceAll("\n", "<br>").replaceAll(" ", "&nbsp;");
        return;
      }
  
      for (kbd of bannedKbdKeys) {
        if (e.key.startsWith(kbd)) {
          return;
        }
      }
  
      vstd += e.key;
  
      stdoutHTML = sanitize(stdout + vstd).replaceAll("\n", "<br>").replaceAll(" ", "&nbsp;");
    }
});
*/

await windowServer.newWindow("terminal", async function main(uuid) {
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
        return "top";
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