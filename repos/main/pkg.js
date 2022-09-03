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
  
  default: {
    input.stdout("ERR: No commands specified!\n\n");
    help();
    
    break;
  }
}