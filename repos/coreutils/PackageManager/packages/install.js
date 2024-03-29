if (!(await isSetUp())) {
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

async function findPackage(name, notCompliant) {
  const contents = JSON.parse(await vfs.read("/etc/pkg/repos.json"));
  
  for (const pkgProviderIndex of Object.keys(contents)) {
    for (const repo of contents[pkgProviderIndex].contents) {
      for (const i of Object.keys(repo.contents)) {
        if (i == name) {
          if (notCompliant) {
            return { // Mix both types of data, for both compliant and not compliant methods
              name: i,
              data: repo.contents[name],
              
              found: true,
              rootPkg: {
                index: pkgProviderIndex,
                path: contents[pkgProviderIndex].path
              },

              corePkg: {
                name: repo.name,
                path: repo.path
              },

              pkgData: repo.contents[name]
            };
          } else {
            return {
              name: i,
              data: repo.contents[name]
            };
          }
        }
      }
    }
  }
}

async function findDependenciesOfPackage(packageFoundData, notCompliant) {
  const dependencyList = [];
  const package = packageFoundData.data;
  
  if (package.deps) {
    for (const dep of package.deps) {
      const dependency = await findPackage(dep, notCompliant);
      if (!dependency) throw new Error(`Could not find package '${dep}'`);

      dependency.isDependency = true;
      dependencyList.push(notCompliant ? dependency : dependency.name);

      if (dependency.data.deps) {
        const deps = await findDependenciesOfPackage(dependency, notCompliant);

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

  const pkg = await findPackage(i, true);
  if (!pkg) {
    logger("error", `Failed to find package '${i}'.`);
    break;
  }

  let deps = {};
  try {
    deps = await findDependenciesOfPackage(pkg, true);
  } catch (e) {
    logger("error", `A dependency for package '${i}' could not be found.`);
    break;
  }

  deps.forEach((i) => logger("info", `Discovered dependency '${i.name}'.`));

  packages.push(...deps, pkg);
}

// TODO: Migrate package install to findPackage();
const pkgData = JSON.parse(await vfs.read("/etc/pkg/repos.json"));

for (const package of removeDuplicateItemsFromArray(packages)) {
  logger("info", `Locating package '${package.name}'...`);
  const data = package; // TODO?
  const existsCheck = await vfs.exists("/etc/pkg/caches.json", "file");
  
  const cache = existsCheck ? JSON.parse(await vfs.read("/etc/pkg/caches.json")) : [];
  const pkgCacheData = cache.find(item => item.pkgName == package.name);
  
  if (typeof pkgCacheData != "undefined" && pkgCacheData.pkgData.ver == data.pkgData.ver) {
    if (!package.isDependency) {
      logger("warn", "Package is already installed, with no updates! Would you like to update anyways?");
    
      input.stdout("> ");
      const choice = await input.stdin();
    
      if (!choice.toLowerCase().startsWith("y")) {
        break;
      }
    }
  }

  logger("info", `Downloading '${package.name}'...`);
  
  const rootPkg = data.rootPkg.path.split("/");
  const corePkg = data.corePkg.path.split("/");
  
  rootPkg.pop();
  corePkg.pop();
  
  const url = rootPkg.join("/") + "/" + corePkg.join("/") + "/" + data.pkgData.path;
  const appData = "UWU;;\n\n" + await read(url);
  
  await vfs.write(`/bin/${package.name}`, appData);
  
  const itemData = {
    pkgName: package.name,
    rootPkg: data.rootPkg,
    corePkg: data.corePkg,
    pkgData: data.pkgData
  };

  if (pkgCacheData) {
    cache.splice(cache.indexOf(pkgCacheData), 1, itemData);
  } else {
    cache.push(itemData);
  }
  
  await vfs.write("/etc/pkg/caches.json", JSON.stringify(cache));
}