async function exec(path, args) {
  const VFS = Kernel.extensions.get("Vfs");
  
  const file = VFS.read(path);
  await Kernel.process.spawn(path, file.replace("UWU;;\n\n"), [input, ...args]);
}