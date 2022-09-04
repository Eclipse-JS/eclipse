qb.enableRegularRequire();

function wipeVFS() {
  localStorage.setItem("vfs", JSON.stringify([{type: "directory", name: "/", owner: "root"}]));
  localStorage.setItem("vfs_ver", "gbvfsR4");
  return JSON.stringify([{type: "directory", name: "/"}]);
}

let fileSystem = !localStorage.getItem("vfs") ? wipeVFS() : localStorage.getItem("vfs");
fileSystem = JSON.parse(fileSystem);

require("./binaries.js");

Kernel.extensions.load("Vfs", function(userData) {
  const VFS = {
    version: () => "gbvfsR4",
    read(rawPath) {
      require("./vfs/read.js")
    },
    write(rawPath, contents) {
      require("./vfs/write.js")
    },
    mkdir(rawPath) {
      require("./vfs/mkdir.js")
    },
    readDir(rawPath) {
      require("./vfs/readDir.js")
    },
    getType(rawPath) {
      require("./vfs/getType.js")
    },
    existsSync(rawPath, fileOrFolder) {
      require("./vfs/existsSync.js")
    },
    sync() {
      localStorage.setItem("vfs", JSON.stringify(fileSystem));
    }
  };

  if (localStorage.getItem("vfs_ver") != VFS.version()) {
    console.error("Incompatible version, wiping drive...");
    localStorage.clear();
    window.location.reload();
  }

  return VFS;
}, true);