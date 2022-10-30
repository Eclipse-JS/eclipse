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

      // Gotta do this redundantly as there is nested for loops.
      if (data.found) break;
    }

    if (data.found) break;
  }

  if (data.found) break;
}

if (!data.found) {
  logger("error", "Package does not exist!");
  break;
}

const cache = vfs.existsSync("/etc/pkg/caches.json", "file") ? JSON.parse(vfs.read("/etc/pkg/caches.json")) : [];

const pkgCacheData = cache.filter(item => item.pkgName == args[1]);

if (pkgCacheData.length != 0 && pkgCacheData[0].pkgData.ver == data.pkgData.ver) {
  logger("warn", "Package is already installed, with no updates! Would you like to update anyways?");
  
  input.stdout("> ");
  const choice = await input.stdin();

  if (!choice.toLowerCase().startsWith("y")) {
    break;
  }
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

vfs.write(`/bin/${args[1]}`, appData);

const itemData = {
  pkgName: args[1],
  rootPkg: data.rootPkg,
  corePkg: data.corePkg,
  pkgData: data.pkgData
};

pkgCacheData.push(itemData);
vfs.write("/etc/pkg/caches.json", JSON.stringify(pkgCacheData));