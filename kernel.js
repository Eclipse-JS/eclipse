function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sanitize(str) {
  return str.replace(/<(.|\n)*?>/g, "");
}

let processList = [];
let avList = [];
let avDev = [];

let pids = 0;

let isKbdEnabled = false;

let stdout = "";
let vstd = "";

let intAppID = 0;

let isCtrl = false;
let isC = false;

let isCtrlC = false;

// For Ctrl+C support

document.addEventListener("keydown", function (e) {
  if (e.keyCode == "17") isCtrl = true;
  if (e.keyCode == "67") isC = true;

  isCtrlC = isCtrl && isC;
});

document.addEventListener("keyup", function (e) {
  if (e.keyCode == "17") isCtrl = false;
  if (e.keyCode == "67") isC = false;

  isCtrlC = isCtrl && isC;
});

// For stdin support
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
      "AudioVolumeDown",
      "AudioVolumeUp",
    ];

    if (e.key == "Enter") {
      isKbdEnabled = false;
      return;
    }

    if (e.key == "Backspace") {
      vstd = vstd.slice(0, -1);
      document.getElementsByClassName("main")[0].innerHTML = sanitize(stdout + vstd).replaceAll("\n", "<br>").replaceAll(" ", "&nbsp;");
      window.scrollTo(0, document.body.scrollHeight);
      return;
    }

    for (kbd of bannedKbdKeys) {
      if (e.key.startsWith(kbd)) {
        return;
      }
    }

    vstd += e.key;

    document.getElementsByClassName("main")[0].innerHTML = sanitize(stdout + vstd).replaceAll("\n", "<br>").replaceAll(" ", "&nbsp;");
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
    document.getElementsByClassName("main")[0].innerHTML = sanitize(stdout).replaceAll("\n", "<br>").replaceAll(" ", "&nbsp;");

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
        throw "Music already playing";
      }

      let audio = new Audio();
      audio.src = src;

      avList.push(audio);
      avDev.push(src);

      avList[avDev.indexOf(src)].play();
    },
    pause: function (src) {
      if (!avDev.includes(src)) {
        throw "Music not playing";
      }

      avList[avDev.indexOf(src)].pause();
    },
    unpause: function (src) {
      if (!avDev.includes(src)) {
        throw "Music not playing";
      }

      avList[avDev.indexOf(src)].play();
    },
  },
  fb: {
    textMode: function () {
      document.getElementsByClassName("main")[0].style.zIndex = "5";
      document.getElementById("canvas-renderer").style.zIndex = "0";
    },
    fbMode: function () {
      document.getElementsByClassName("main")[0].style.zIndex = "0";
      document.getElementById("canvas-renderer").style.zIndex = "5";
    },
    getFB: function () {
      return document.getElementById("canvas-renderer").getContext("2d");
    }
  },
  paste: function (self, e) {
    let text = e.clipboardData.getData("text/plain");
    console.log(text);

    if (isKbdEnabled) {
      vstd += text;

      document.getElementsByClassName("main")[0].innerHTML = sanitize(stdout + vstd).replaceAll("\n", "<br>").replaceAll(" ", "&nbsp;");
      window.scrollTo(0, document.body.scrollHeight);
    }
  },
  users: {
    list: function () {
      if (localStorage.getItem("users") == null) {
        throw "Users not found!";
      }

      return JSON.parse(localStorage.getItem("users"));
    },
  },
  initExec: async function (func) {
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
  plist: function () {
    return processList;
  },
};

async function stopCodeExec() {
  while (true) {
    await sleep(100);

    if (isCtrlC) window.location.reload();
  }
}

stopCodeExec();
