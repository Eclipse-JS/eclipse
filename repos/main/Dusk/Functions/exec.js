async function exec(path, argv) {
  const VFS = await Kernel.extensions.get("Vfs");
  
  const file = await VFS.read(path);
  await Kernel.process.spawn(path, file.replace("UWU;;\n\n", ""), [, ...argv]);
}