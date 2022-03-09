function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let processList = [];
let avList = [];
let avDev = [];

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
  audio: {
    play: function (src) {
      if (avDev.includes(src)) {
        throw("Music already playing");
      }
      
      let audio = new Audio();
      audio.src = src;

      avList.push(audio);
      avDev.push(src);
      
      avList[avDev.indexOf(src)].play();
    },
    pause: function (src) {
      if (!avDev.includes(src)) {
        throw("Music not playing");
      }

      avList[avDev.indexOf(src)].pause();
    },
    unpause: function (src) {
      if (!avDev.includes(src)) {
        throw("Music not playing");
      }

      avList[avDev.indexOf(src)].play();
    }
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
  users: {
    list: function () {
      if (localStorage.getItem("users") == null) {
        throw("Users not found!");
      }
      
      return(JSON.parse(localStorage.getItem("users")));
    }
  },
  initExec: async function(func) {
    if (typeof func !== "function") {
      throw "Not a process";
    }

    for (local of processList) {
      if (local[1] == 0) {
        throw "Init already running";
      }
    }

    processList.push(["init", 0]);

    try {
      await func();
    } catch (e) {
      alert("Kernel panic: Init has crashed with error " + e);
      window.location.reload();
    } finally {
      alert("Kernel panic: Attempted to kill init!");
      window.location.reload();
    }
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
      if (local[0] !== name) localPk.push(local);
    }

    processList = localPk;
  },
  plist: function() {
    return processList;
  },
};