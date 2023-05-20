async function renderCanvas(ws, input) {
  // Replaced with CanvasWall, now a dependency
  async function exec(path, argv) {
    const VFS = await Kernel.extensions.get("Vfs");
    
    const file = await VFS.read(path);
    await Kernel.process.spawn(path, file.replace("UWU;;\n\n", ""), [...argv]);
  }

  await exec("/bin/canvaswall", ["SimpleRGB"]);
}