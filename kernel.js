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

const kernel = {
  ver: "0.3.0",
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
      document.getElementById("html-renderer").style.zIndex = "0";
    },
    wmMode: function () {
      document.getElementsByClassName("main")[0].style.zIndex = "0";
      document.getElementById("html-renderer").style.zIndex = "5";
    },
    getWMObject: function () {
      return document.getElementById("html-renderer");
    }
  },
  paste: function (self, e) {
    let text = e.clipboardData.getData("text/plain");
    console.log(text);

    if (isKbdEnabled) {
      vstd += text;

      document.getElementsByClassName("main")[0].innerHTML = sanitize(stdout + vstd).replaceAll("\n", "<br>").replaceAll(" ", "&nbsp;");
      document.getElementsByClassName("main")[0].scrollTo(0, document.getElementsByClassName("main")[0].scrollHeight);
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
