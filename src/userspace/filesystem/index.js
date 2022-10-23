qb.enableRegularRequire();

function wipeVFS() {
  localStorage.setItem("vfs", JSON.stringify([{type: "directory", name: "/", owner: "root"}]));
  localStorage.setItem("vfs_ver", "gbvfsR4");
  return JSON.stringify([{type: "directory", name: "/"}]);
}

let fileSystem = !localStorage.getItem("vfs") ? wipeVFS() : localStorage.getItem("vfs");
fileSystem = JSON.parse(fileSystem);

let activeBackend = "gbrfs";

require("./selectBackends.js");

Kernel.extensions.load("Vfs", function(userData) {
  const backendData = fsMap.find(i => i.name == activeBackend);

  if (!backendData) {
    throw "VFS Panic!! Cannot find eligible filesystem.";
  }

  const backend = backendData.func(userData, true);

  const VFS = {
    version: () => backend.version(),
    read: (rawPath) => backend.read(rawPath),
    write: (rawPath, contents) => backend.write(rawPath, contents),
    mkdir: (rawPath) => backend.mkdir(rawPath),
    readDir: (rawPath) => backend.readDir(rawPath),
    getType: (rawPath) => backend.getType(rawPath),
    existsSync: (rawPath, fileOrFolder) => backend.existsSync(rawPath, fileOrFolder),
    sync: () => backend.sync(),
    changeBackend: (name) => {
      if (userData.permLevel != 0) {
        throw new Error("No permission!");
      }
  
      const newBackend = fsMap.find(i => i.name == name);
      if (!newBackend) {
        throw new Error("Filesystem backend does not exist!");
      }
  
      activeBackend = name;
    }
  };

  if (localStorage.getItem("panic.log")) {
    if (!VFS.existsSync("/etc", "directory")) {
      VFS.mkdir("/etc");
    }

    VFS.write("/etc/panic.log", localStorage.getItem("panic.log"));
    localStorage.removeItem("panic.log");
  }

  return VFS;
}, true);