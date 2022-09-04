function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function execJS(name, path) {
  const data = await fetch(path);
  const dataText = await data.text();

  const processData = Kernel.process.create(dataText);
  await Kernel.process.spawn(name, processData); 
}

console.log("Loading VFS Libraries...");

if (localStorage.getItem("preboot_vfs")) {
  const binData = localStorage.getItem("preboot_vfs");

  const process = Kernel.process.create(binData.replaceAll("UWU;;\n\n", ""));
  await Kernel.process.spawn("initvfs", process);
} else {
  await execJS("initvfs", "init/vfs.js");
}

const VFS = Kernel.extensions.get("Vfs");

if (VFS.existsSync("/bin/sys", "file")) {
  console.log("Found local copy of Sys");

  const binData = VFS.read("/bin/sys");

  const process = Kernel.process.create(binData.replaceAll("UWU;;\n\n", ""));
  await Kernel.process.spawn("sys", process);
} else {
  await execJS("booter", "init/sys.js");
}

const Sys = Kernel.extensions.get("sys");

Sys.drawLogo();
Sys.loadPercent(10);

const security = Kernel.extensions.get("genkernel");

console.log("Loading binaries...");

if (!VFS.existsSync("/etc/init.d/init.conf", "file")) {
  console.log("No binaries found! Loading liboostrap...");

  await execJS("bootstrap", "init/bootstrap.js");
}

console.log("Loading programs...");
const initPrgms = VFS.read("/etc/init.d/init.conf").split("\n");
const onloadProgram = VFS.read("/etc/init.d/initcmd.txt");

for (i of initPrgms) {
  try {
    const binData = VFS.read(i);

    const process = Kernel.process.create(binData.replaceAll("UWU;;\n\n", ""));
    await Kernel.process.spawn(i, process);
  } catch (e) {
    console.error("Failed to execute '" + i + "'.");
  }
}
  
const binData = VFS.read(onloadProgram);

console.log("Init: Goodbye! De-escelating to '%s'...", "nobody");
await Kernel.accounts.elevate("nobody");

const process = Kernel.process.create(binData.replaceAll("UWU;;\n\n", ""));
await Kernel.process.spawn(onloadProgram, process, []);