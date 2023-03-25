qb.enableRegularRequire();

function wipeVFS() {
  localStorage.setItem("vfs", JSON.stringify([{type: "directory", name: "/", owner: "root"}]));
  localStorage.setItem("vfs_ver", "gbvfsR5");
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
    version: async() => {
      console.log("fs.version called; telem=", userData());
      return await backend.version();
    },
    read: async(rawPath) => { 
      console.log("fs.read called; telem=", userData());
      return await backend.read(rawPath);
    },
    write: async(rawPath, contents) => {
      console.log("fs.write called; telem=", userData());
      return await backend.write(rawPath, contents);
    },
    mkdir: async(rawPath) => {
      console.log("fs.mkdir called; telem=", userData());
      return await backend.mkdir(rawPath);
    },
    readDir: async(rawPath) => {
      console.log("fs.readDir called; telem=", userData());
      return await backend.readDir(rawPath);
    },
    getType: async(rawPath) => {
      console.log("fs.getType called; telem=", userData());
      return await backend.getType(rawPath);
    },
    exists: async(rawPath, fileOrFolder) => {
      console.log("fs.exists called; telem=", userData());
      return await backend.existsSync(rawPath, fileOrFolder);
    },
    sync: async() => {
      console.log("fs.sync called; telem=", userData());
      return await backend.sync();
    },
    changeBackend: async(name) => {
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

  /*
  if (localStorage.getItem("panic.log")) {
    if (!VFS.existsSync("/etc", "directory")) {
      VFS.mkdir("/etc");
    }

    VFS.write("/etc/panic.log", localStorage.getItem("panic.log"));
    localStorage.removeItem("panic.log");
  }
  */

  return VFS;
}, true);