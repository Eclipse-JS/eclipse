if (!isSetUp()) {
  logger("error", "The package manager is not set up! Please run 'pkg init'.");
  break;
} 

const packagesArgv = argv.slice(1).map((i) => i.trim());

if (packagesArgv.length == 0) {
  logger("error", "No packages specified.");
  break;
}

function removeDuplicateItemsFromArray(arr) {
  return [...new Set(arr)];
}

function findPackage(name) {
  const contents = JSON.parse(vfs.read("/etc/pkg/repos.json"));
  
  for (const pkgProviderIndex of Object.keys(contents)) {
    for (const repo of contents[pkgProviderIndex].contents) {
      for (const i of Object.keys(repo.contents)) {
        if (i == name) return {
          name: i,
          data: repo.contents[name]
        };
      }
    }
  }
}

function findDependenciesOfPackage(packageFoundData) {
  const dependencyList = [];
  const package = packageFoundData.data;
  
  if (package.deps) {
    for (const dep of package.deps) {
      const dependency = findPackage(dep);
      if (!dependency) throw new Error(`Could not find package '${dep}'`);

      dependencyList.push(dependency.name);

      if (dependency.data.deps) {
        const deps = findDependenciesOfPackage(dependency);

        dependencyList.push(...deps);
      }
    }
  }

  return removeDuplicateItemsFromArray(dependencyList);
}

logger("info", "Getting package install list...");
const packages = [];

for (const i of packagesArgv) {
  if (i == "") return;
  logger("info", `Getting package canidates for '${i}'...`);

  const pkg = findPackage(i);
  if (!pkg) {
    logger("error", `Failed to find package '${i}'.`);
    break;
  }

  const deps = findDependenciesOfPackage(pkg);
  deps.forEach((i) => logger("info", `Discovered dependency '${i}'.`));

  packages.push(...deps, i);
}

// TODO: Migrate package install to findPackage();
const pkgData = JSON.parse(vfs.read("/etc/pkg/repos.json"));

for (const package of removeDuplicateItemsFromArray(packages)) {
  logger("info", `Locating package '${package}'...`)
  
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
        if (k == package) {
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
  
  const pkgCacheData = cache.filter(item => item.pkgName == package);
  
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
  
  logger("info", `Downloading '${package}'...`);
  
  const rootPkg = data.rootPkg.path.split("/");
  const corePkg = data.corePkg.path.split("/");
  
  rootPkg.pop();
  corePkg.pop();
  
  const url = rootPkg.join("/") + "/" + corePkg.join("/") + "/" + data.pkgData.path;
  const appData = "UWU;;\n\n" + await read(url);
  
  vfs.write(`/bin/${package}`, appData);
  
  const itemData = {
    pkgName: package,
    rootPkg: data.rootPkg,
    corePkg: data.corePkg,
    pkgData: data.pkgData
  };
  
  cache.push(itemData);
  vfs.write("/etc/pkg/caches.json", JSON.stringify(cache));
}