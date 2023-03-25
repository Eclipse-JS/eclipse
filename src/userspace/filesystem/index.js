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
      return await backend.exists(rawPath, fileOrFolder);
    },
    sync: async() => {
      console.log("fs.sync called; telem=", userData());
      return await backend.sync();
    }
  };

  return VFS;
}, true);