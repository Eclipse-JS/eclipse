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
    
    if (localStorage.getItem("autostart.rc") == null) {
      kernel.stdout("  No autostart.rc found. Creating.\n");
      localStorage.setItem("autostart.rc", 'setup');
      kernel.stdout("  Default is set to 'setup', the system setup sequence.\n");
    }

    if (localStorage.getItem("fselect_manifest") == null) {
      kernel.stdout("  Could not find manifest database. Creating.\n");
      localStorage.setItem("fselect_manifest", '["/setupAssistant/manifest.json"]');
    }

    kernel.stdout("Building applications manifest...\n");
    kernel.stdout("  Fetching femOS Base System manifest...\n");
    let manifest = [];

    kernel.stdout("  Fetching manifests...\n");

    let fselect = JSON.parse(localStorage.getItem("fselect_manifest"));

    for (repo of fselect) {
      try {
          let resp = await axios.get(repo);

          for (app of resp.data) {
            manifest.push(app);
           }
      } catch (e) {
          kernel.stdout("    Could not fetch '" + repo + "'\n");
          console.error(e);
      }
    }

    kernel.stdout("\n");

    for await (item of manifest) {
      kernel.stdout("Loading:", item.name);

      try {
        let app = await axios.get(item.path);
        let func = new AsyncFunction("args", app.data);

        Applications.push({ name: item.name, function: func });

        kernel.stdout(" [OK]\n");
      } catch (e) {
        console.error(e);
        kernel.stdout(" [FAIL]\n");
      }
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
