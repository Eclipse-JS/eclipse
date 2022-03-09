function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let processList = [];
let pids = 0;

let isKbdEnabled = false;

let stdout = "";
let vstd = "";

let hasCtrl = false;

document.addEventListener("keyup", function (e) {
    if (e.key == "Control") {
        hasCtrl = false;
    }
})

document.addEventListener("keydown", function (e) {
  if (isKbdEnabled) {
    let bannedKbdKeys = [
      "Control",
      "Alt",
      "WakeUp",
      "Meta",
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
    ];

    if (e.key == "Enter") {
      isKbdEnabled = false;
      return;
    }

    if (e.key == "Backspace") {
      vstd = vstd.slice(0, -1);
      document.getElementsByClassName("main")[0].innerText = stdout + vstd;
      window.scrollTo(0, document.body.scrollHeight);
      return;
    }

    let check = false;

    for (kbd of bannedKbdKeys) {
      if (e.key.startsWith(kbd) || hasCtrl) {
        if (kbd == "Control") {
            hasCtrl = true;
        }

        return;
      }
    }

    vstd += e.key;

    document.getElementsByClassName("main")[0].innerText = stdout + vstd;
    window.scrollTo(0, document.body.scrollHeight);
  }
});

const kernel = {
  ver: "0.1.0",
  stdout: function (...args) {
    let argv = args.join(" ");

    if (argv == "jsKernelReq$cls") {
      document.getElementsByClassName("main")[0].innerText = "";
      stdout = "";
      return;
    }
    stdout += argv;
    document.getElementsByClassName("main")[0].innerText = stdout;

    window.scrollTo(0, document.body.scrollHeight);
  },
  playAudio: function (src) {
    let audio = new Audio();
    audio.src = src;
    audio.play();
  },
  paste: function (self, e) {
    let text = e.clipboardData.getData("text/plain");
    console.log(text);

    if (isKbdEnabled) {
        vstd += text;
    
        document.getElementsByClassName("main")[0].innerText = stdout + vstd;
        window.scrollTo(0, document.body.scrollHeight);
    }
  },
  stdin: async function () {
    isKbdEnabled = true;

    while (isKbdEnabled !== false) {
      await sleep(100);
    }

    let vsh = vstd;
    vstd = "";

    kernel.stdout(vsh, "\n");

    return vsh;
  },
  pexec: async function (name, func, args) {
    if (typeof func !== "function") {
      throw "Not a process";
    }

    pids++;
    processList.push([name, pids]);

    if (args) {
      await func(args);
    } else {
      await func([]);
    }

    let localPk = [];
    for (local of processList) {
      if (local !== name) localPk.push(local);
    }

    processList = localPk;
  },
  plist: processList,
};
