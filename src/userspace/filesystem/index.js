qb.enableRegularRequire();
require("./backends/index.js")

if (!localStorage.getItem("active_fs")) localStorage.setItem("active_fs", "gbrfs");
const activeFS = localStorage.getItem("active_fs");

const fsOptions = getEligibleFilesystems();

Kernel.extensions.load("Vfs", async function(userData) {
  const backendData = fsOptions.find((i) => i.name == activeFS);
  if (!backendData) throw new Error("FSError: Cannot find eligible filesystem.");

  const backend = await backendData.func(userData);

  const VFS = {
    version: async() => {
      return await backend.version();
    },
    read: async(rawPath) => { 
      return await backend.read(rawPath);
    },
    write: async(rawPath, contents) => {
      return await backend.write(rawPath, contents);
    },
    mkdir: async(rawPath) => {
      return await backend.mkdir(rawPath);
    },
    readDir: async(rawPath) => {
      return await backend.readDir(rawPath);
    },
    getType: async(rawPath) => {
      return await backend.getType(rawPath);
    },
    exists: async(rawPath, fileOrFolder) => {
      return await backend.exists(rawPath, fileOrFolder);
    },
    sync: async() => {
      return await backend.sync();
    }
  };

  return VFS;
}, true);