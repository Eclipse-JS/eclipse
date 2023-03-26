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
    version: () => backend.version(),
    read: async(rawPath) => await backend.read(rawPath),
    write: async(rawPath, contents) => await backend.write(rawPath, contents),
    mkdir: async(rawPath) => await backend.mkdir(rawPath),
    readDir: async(rawPath) => await backend.readDir(rawPath),
    getType: async(rawPath) => await backend.getType(rawPath),
    exists: async(rawPath, fileOrFolder) => await backend.exists(rawPath, fileOrFolder),
    sync: async() => await backend.sync()
  };

  if (localStorage.getItem("panic.log")) {
    if (!(await VFS.exists("/etc", "folder"))) await VFS.mkdir("/etc");
    await VFS.write("/etc/panic.log", localStorage.getItem("panic.log"));

    localStorage.removeItem("panic.log");
  }

  return VFS;
}, true);