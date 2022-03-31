const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

let Applications = [];

// Reserved.
let windowServer = {};

// Keyboard stuff
let isCtrl = false;
let isC = false;

let isCtrlC = false;

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
      document.getElementsByClassName("main")[0].innerHTML = sanitize(stdout + vstd).replaceAll("\n", "<br>").replaceAll(" ", "&nbsp;");
      document.getElementsByClassName("main")[0].scrollTo(0, document.getElementsByClassName("main")[0].scrollHeight);
      return;
    }

    for (kbd of bannedKbdKeys) {
      if (e.key.startsWith(kbd)) {
        return;
      }
    }

    vstd += e.key;

    document.getElementsByClassName("main")[0].innerHTML = sanitize(stdout + vstd).replaceAll("\n", "<br>").replaceAll(" ", "&nbsp;");
    document.getElementsByClassName("main")[0].scrollTo(0, document.getElementsByClassName("main")[0].scrollHeight);
  }
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function ctrlC() {
  while (true) {
    await sleep(100);
    if (isCtrl && isC) window.location.reload();
  }
}

ctrlC(); // broken for now

addEventListener("DOMContentLoaded", async function () {
  console.log("earlycon at console.log();");
  console.log("loading textfb-friendly kernel...");

  let KernelLocal = kernel;

  KernelLocal.ver += ".kdpatch" // keyboard driver patch

  KernelLocal.stdout = function (...args) {
    let argv = args.join(" ");

    if (argv == "jsKernelReq$cls") {
      document.getElementsByClassName("main")[0].innerText = "";
      stdout = "";
      return;
    }
    stdout += argv;
    document.getElementsByClassName("main")[0].innerHTML = sanitize(stdout).replaceAll("\n", "<br>").replaceAll(" ", "&nbsp;");

    document.getElementsByClassName("main")[0].scrollTo(0, document.getElementsByClassName("main")[0].scrollHeight);
  }

  KernelLocal.stdin = async function () {
    isKbdEnabled = true;

    while (isKbdEnabled !== false) {
      await sleep(100);
    }

    let vsh = vstd;
    vstd = "";

    KernelLocal.stdout(vsh, "\n");

    return vsh;
  }
  
  kernel.initExec(async function () {
    let kernel = KernelLocal;
    console.log("loaded. booting with patched kernel...");
    kernel.stdout("femInit v0.1.1\n");
    kernel.stdout("Checking if system config is sane...\n");
    
    if (localStorage.getItem("osversion.rc") == null) {
      kernel.stdout("  Could not find osversion.rc. Creating.\n");
      localStorage.setItem("osversion.rc", '1');
    }  

    if (localStorage.getItem("autostart.rc") == null) {
      kernel.stdout("  No autostart.rc found. Creating.\n");

      localStorage.setItem("autostart.rc", 'setup');
    }

    if (localStorage.getItem("fselect_manifest") == null || localStorage.getItem("packages.rc") == null) {
      kernel.stdout("  Could not find manifest database (or other error). Loading setup...\n");
      let setup = await axios.get("nmp/setup.js");
      setup = setup.data;

      try {
        await new AsyncFunction("args", setup)();
      } catch (e) {
        kernel.stdout(e);
        await sleep(5000);
        window.location.reload();
      }
    }

    kernel.stdout("\n");

    let packages = localStorage.getItem("packages.rc");
    packages = JSON.parse(packages);

    for await (app of packages) {
      kernel.stdout(`Decompressing package ${app.name}...\n`);
      Applications.push({ name: app.name, version: app.version, function: new AsyncFunction("args", atob(app.function)) });
    }

    kernel.stdout("\nApplications loaded.\n\n");

    let shellIndex = 0;

    for (let i = 0; i < Applications.length; i++) {
      if (Applications[i].name == localStorage.getItem("autostart.rc")) {
        shellIndex = i;
        break;
      }
    }

    try {
      await kernel.pexec(
        Applications[shellIndex].name,
        Applications[shellIndex].function
      );
    } catch (e) {
      kernel.stdout("Error running shell:", e, "\n");

      while (true) {
        await sleep(1000);
      }
    }
  });
});
