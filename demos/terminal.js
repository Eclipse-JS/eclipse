let Kernel = kernel;
let UUID = "";

if (!windowServer.newWindow) {
    kernel.stdout("WindowServer is not running.");
    return;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

let stdout = "";

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
      let vstd = "";

      while (!vstd.endsWith("\n")) {
        let invalid = false;
        let input = await windowServer.getKeyboardData(UUID);

        //console.log(input)

        for (i of bannedKbdKeys) if (input.startsWith(i)) invalid = true;

        if (!invalid && input == "Backspace") {
          vstd = vstd.slice(0, -1);
        } else if (!invalid) {
          vstd += input;
        }

        elem.innerHTML = sanitize(stdout + vstd).replaceAll("\n", "<br>").replaceAll(" ", "&nbsp;");
        elem.scrollTo(0, elem.scrollHeight);
      }

      kernel.stdout(vstd);

      return vstd.replaceAll("\n", "");
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