const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

let Applications = [];

// Reserved.
let windowServer = {};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

addEventListener("DOMContentLoaded", async function () {
  kernel.initExec(async function () {
    kernel.stdout("femInit v0.0.1\n");
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

    kernel.stdout("\n");
    kernel.stdout("Applications loaded.\n\n");

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
