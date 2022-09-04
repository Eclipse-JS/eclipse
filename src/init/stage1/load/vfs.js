if (localStorage.getItem("preboot_vfs")) {
  const binData = localStorage.getItem("preboot_vfs");

  const process = Kernel.process.create(binData.replaceAll("UWU;;\n\n", ""));
  await Kernel.process.spawn("initvfs", process);
} else {
  await execJS("initvfs", "init/vfs.js");
}
