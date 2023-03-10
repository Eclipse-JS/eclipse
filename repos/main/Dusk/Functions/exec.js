async function exec(path, argv) {
  const VFS = Kernel.extensions.get("Vfs");
  
  const file = VFS.read(path);
  await Kernel.process.spawn(path, file.replace("UWU;;\n\n", ""), [, ...argv]);
}