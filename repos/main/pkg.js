const args = argv;
const input = args.shift();

if (Kernel.accounts.getCurrentInfo().permLevel != 0) {
  input.stdout("You must be root!\n");
  return;
}

const vfs = Kernel.extensions.get("Vfs");

function logger(type, ...args) {
  input.stdout(`[${type.toUpperCase()}] ${args.join(" ")}\n`);
}

async function read(path) {
  const data = await fetch(path);
  const dataText = await data.text();

  return dataText;
}


function help() {
  const cmds = [
  {
    name: "init",
    desc: "Initialize package manager"
  }
  ]

  for (i of cmds) {
    input.stdout(`${i.name}: ${i.desc}\n`);
  }
}

function isSetUp() {
  if (vfs.existsSync("/etc/pkg/isSetup", "file")) return true;
  return false;
}

function appendHeader(str) {
  return "UWU;;\n\n" + str;
}

switch (args[0]) {
  case "init": {
    logger("info", "Bootstrapping...");

    if (isSetUp()) {
      logger("error", "Pkg is already setup, silly!");
      break;
    }

    if (!vfs.existsSync("/etc/pkg", "directory")) vfs.mkdir("/etc/pkg");

    logger("info", "Downloading root packages...");

    const rootPkgServer = JSON.parse(await read("repos/rootpkgserver.json"));
    let items = {};

    items[rootPkgServer.identifier] = {
      contents: rootPkgServer.contents,
      path: "repos/rootpkgserver.json"
    };

    for (const index in items[rootPkgServer.identifier].contents) {
      const i = items[rootPkgServer.identifier].contents[index];
      logger("info", `Setting up repo '${i.name}'...`);

      const file = JSON.parse(await read("repos/" + i.path));

      items[rootPkgServer.identifier].contents[index].contents = file.packages;
    }

    vfs.write("/etc/pkg/repos.json", JSON.stringify(items));
    vfs.write("/etc/pkg/isSetup", "do you want a furry for christmas - August, 2022\n"); // ;) hi

    break;
  }

  case "update": {
    if (!isSetUp()) {
      logger("error", "The package manager is not set up! Please run 'pkg init'.");
      break;
    }

    const oldContents = JSON.parse(vfs.read("/etc/pkg/repos.json"));
    let items = {};

    for (const oldIndex of Object.keys(oldContents)) {
      const i = oldContents[oldIndex];
      logger("info", `Downloading root repo '${oldIndex}'...`);

      const data = JSON.parse(await read(i.path));

      items[oldIndex] = {
        contents: data.contents,
        path: i.path
      }

      for (const index in items[oldIndex].contents) {
        const i = items[oldIndex].contents[index];
        logger("info", `Setting up repo '${i.name}'...`);
  
        const file = JSON.parse(await read("repos/" + i.path));
  
        items[oldIndex].contents[index].contents = file.packages;
      }
    }

    vfs.write("/etc/pkg/repos.json", JSON.stringify(items));
    vfs.write("/etc/pkg/isSetup", "do you want a furry for christmas - August, 2022\n"); // ;) hi
    // FIXME (vfs): For some reason, it also removes the isSetup when writing repos.json. WTF?

    break;
  }

  case "install": {
    if (!isSetUp()) {
      logger("error", "The package manager is not set up! Please run 'pkg init'.");
      break;
    } else if (typeof args[1] != "string") {
      logger("error", "Invalid argument (take it to twitter)");
      break;
    }

    logger("info", `Locating package '${args[1]}'...`)
    const pkgData = JSON.parse(vfs.read("/etc/pkg/repos.json"));

    let data = {
      found: false,
      rootPkg: null,
      corePkg: null,
      pkgData: null
    }
    
    for (const index of Object.keys(pkgData)) {
      const i = pkgData[index];

      for (const j of i.contents) {
        for (const k of Object.keys(j.contents)) {
          if (k == args[1]) {
            data.found = true;

            data.rootPkg = {};
            data.rootPkg.index = index;
            data.rootPkg.path = i.path;

            data.corePkg = {};
            data.corePkg.name = j.name;
            data.corePkg.path = j.path;

            data.pkgData = j.contents[k];

            break;
          }
        }

        if (data.found) break;
      }

      if (data.found) break;
    }

    if (!data.found) {
      logger("error", "Package does not exist!");
      break;
    }

    const cache = vfs.existsSync("/etc/vfs/caches.json", "file") ? JSON.parse(vfs.read("/etc/vfs/caches.json")) : [];

    const pkgCacheData = cache.filter(item => item.pkgName == args[1]);

    if (pkgCacheData.length != 0 && pkgCacheData[0].pkgData.ver == data.pkgData.ver) {
      logger("error", "Package is already installed, with no updates!");
      break;
    }

    for (const data in pkgCacheData) {
      cache.splice(cache.indexOf(data), 1);
    }

    logger("info", `Downloading '${args[1]}'...`);

    const rootPkg = data.rootPkg.path.split("/");
    const corePkg = data.corePkg.path.split("/");

    rootPkg.pop();
    corePkg.pop();
    
    const url = rootPkg.join("/") + "/" + corePkg.join("/") + "/" + data.pkgData.path;
    const appData = "UWU;;\n\n" + await read(url);

    vfs.write(`/bin/${data.pkgData.path.replace(".js", "")}`, appData);

    const itemData = {
      pkgName: data.pkgData.path.replace(".js", ""),
      rootPkg: data.rootPkg,
      corePkg: data.corePkg,
      pkgData: data.pkgData
    };

    pkgCacheData.push(itemData);
    vfs.write("/etc/pkg/caches.json", JSON.stringify(pkgCacheData));

    break;
  }
  
  default: {
    input.stdout("ERR: No commands specified!\n\n");
    help();
    
    break;
  }
}