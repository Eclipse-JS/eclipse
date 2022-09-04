if (VFS.existsSync("/bin/sys", "file")) {
  console.log("Found local copy of Sys");

  const binData = VFS.read("/bin/sys");

  const process = Kernel.process.create(binData.replaceAll("UWU;;\n\n", ""));
  await Kernel.process.spawn("sys", process);
} else {
  await execJS("booter", "init/sys.js");
}