let arg = args[0];


if (args[1] !== undefined) {
  arg += ` ${args[1]}`;
}

switch (arg) {
  case "help":
    kernel.stdout("fselect version 0.1.0 - Not a furry package manager.\n");
    kernel.stdout("Usage: fselect <command> [args]\n");
    kernel.stdout("Available commands:\n");
    kernel.stdout("  help - Displays this help message.\n");
    kernel.stdout("  repo add <repo> - Adds a repository.\n");
    kernel.stdout("  repo remove <repo> - Removes a repository.\n");
    kernel.stdout("  repo update - Updates repository listings.\n");
    kernel.stdout("  repo md - List valid approved repositories.\n");
    kernel.stdout("  pkg install - Installs app.\n");
    kernel.stdout("  pkg remove - Removes app.\n");
    kernel.stdout("  pkg search - Searches for an app.");
    break;
  case "pkg install":
    if (args[2] === undefined) {
      kernel.stdout("Usage: fselect pkg install <app>\n");
      break;
    }

    kernel.stdout("Getting package list...\n");
    
    var manifest = JSON.parse(localStorage.getItem("manifestCache.rc"));
    var installedApps = JSON.parse(localStorage.getItem("packages.rc"));
    
    var app = installedApps.find(app => app.name === args[2]);
    
    if (app === undefined) {
      let isAppInstalled = manifest.find(app => JSON.parse(atob(app.data)).find(apps => apps.name == args[2]));

      if (isAppInstalled !== undefined) {
        let appData = JSON.parse(atob(isAppInstalled.data));
        appData = appData.find(apps => apps.name == args[2]);

        console.log(appData);
        kernel.stdout(`Installing ${appData.name}...`);

        let js = await axios.get(appData.path);
        js = js.data;

        let localFunc = localStorage.getItem("packages.rc");
        localFunc = JSON.parse(localFunc);

        localFunc.push({
          name: appData.name,
          version: appData.version,
          function: btoa(js)
        });

        localStorage.setItem("packages.rc", JSON.stringify(localFunc));
      } else {
        kernel.stdout("Could not find app.\nThis can be caused by broken databases. Try running 'fselect repo update' to update the database.");
      }
    } else {
      kernel.stdout(`App already installed.`);
    }

    break;
  case "pkg remove":
    if (args[2] === undefined) {
      kernel.stdout("Usage: fselect pkg remove <app>");
      break;
    }

    var installedApps = JSON.parse(localStorage.getItem("packages.rc"));
    var app = installedApps.find(app => app.name === args[2]);

    if (app !== undefined) {
      kernel.stdout(`Removing ${app.name}...`);

      let localFunc = localStorage.getItem("packages.rc");
      localFunc = JSON.parse(localFunc);

      localFunc = localFunc.filter(app => app.name !== args[2]);

      localStorage.setItem("packages.rc", JSON.stringify(localFunc));
    }

    break;
  case "pkg search":
    kernel.stdout("Not implemented!");
    break;
  case "repo add":
    if (args[2] == undefined) {
      kernel.stdout("Error: No repository specified.\n");
      kernel.stdout("Usage: fselect repo add <repo>\n");
      kernel.stdout("Type 'fselect help' for more information.");
    } else {
      let url = args[2];

      if (!url.startsWith("http://") || !url.startsWith("https://")) {
        if (!url.startsWith("/")) {
          url = "/" + url + "/manifest.json";
        } else {
          url = "https://" + url;
        }
      }

      var manifestCache = [];

      let items = localStorage.getItem("fselect_manifest").toString().split("");
      items.pop();

      if (items.length - 1 == 0) {
        items.push('"' + url + '"');
      } else {
        items.push(',"' + url + '"');
      }

      items.push("]");

      localStorage.setItem("fselect_manifest", items.join(""));

      kernel.stdout("Added repository '" + url + "' to init.\n");
      kernel.stdout("Updating package lists...");

      for await (item of JSON.parse(localStorage.getItem("fselect_manifest"))) {
        try {
          let resp = await axios.get(item);
          manifestCache.push({ path: item, data: btoa(JSON.stringify(resp.data)) });
        } catch (e) {
          kernel.stdout("Could not fetch '" + item + "'\n");
          console.error(e);
        }
      }

      localStorage.setItem("manifestCache.rc", JSON.stringify(manifestCache));
    }
    break;
  case "repo remove":
    if (args[2] == undefined) {
      kernel.stdout("Error: No repository specified.\n");
      kernel.stdout("Usage: fselect repo remove <repo>\n");
      kernel.stdout("Type 'fselect help' for more information.");
      break;
    }

    let url = args[2];
    let items = [];

    var manifestCache = [];

    if (!url.startsWith("http://") || !url.startsWith("https://")) {
      if (!url.startsWith("/")) {
        url = "/" + url + "/manifest.json";
      } else {
        url = "https://" + url;
      }
    }

    for (item of JSON.parse(localStorage.getItem("fselect_manifest"))) {
      if (item != url) {
        items.push(item);
      } else {
        kernel.stdout("Removed repository '" + url + "' from init.\n");
      }
    }

    localStorage.setItem("fselect_manifest", JSON.stringify(items));
    kernel.stdout("Updating package lists...");

    for await (item of JSON.parse(localStorage.getItem("fselect_manifest"))) {
      try {
        let resp = await axios.get(item);
        manifestCache.push({ path: item, data: btoa(JSON.stringify(resp.data)) });
      } catch (e) {
        kernel.stdout("Could not fetch '" + item + "'\n");
        console.error(e);
      }
    }

    localStorage.setItem("manifestCache.rc", JSON.stringify(manifestCache));
    break;
  case "repo update":
    kernel.stdout("Updating package lists...");
    var manifestCache = [];

    for await (item of JSON.parse(localStorage.getItem("fselect_manifest"))) {
      try {
        let resp = await axios.get(item);
        manifestCache.push({ path: item, data: btoa(JSON.stringify(resp.data)) });
      } catch (e) {
        kernel.stdout("Could not fetch '" + item + "'\n");
        console.error(e);
      }
    }

    localStorage.setItem("manifestCache.rc", JSON.stringify(manifestCache));
    break;
  case "repo md":
    kernel.stdout("Fetching from server...\n\n");
    let data = await axios.get("manifest_details.txt");
  
    kernel.stdout(data.data);
    break;
  default:
    kernel.stdout("Error: No command specified.\n");
    kernel.stdout("Usage: fselect <command> [args]\n");
    kernel.stdout("Type 'fselect help' for more information.");
    break;
}
