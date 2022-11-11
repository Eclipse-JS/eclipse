qb.enableRegularRequire();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function read(path) {
  const data = await fetch(path);
  const dataText = await data.text();

  return dataText;
}

async function execJS(name, path) {
  const data = await read(path);

  const processData = Kernel.process.create(data);
  await Kernel.process.spawn(name, processData); 
}

console.log("Loading VFS Libraries...");
require("./load/vfs.js");

const VFS = Kernel.extensions.get("Vfs");
if (argv[0]) {
  VFS.mkdir("/root");
  VFS.mkdir("/home");
}

require("./load/sys.js");

const Sys = Kernel.extensions.get("sys");

Sys.drawLogo();
Sys.loadPercent(10);

console.log("Loading binaries...");
require("./load/boostrap_check.js");

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

const process = Kernel.process.create(binData.replaceAll("UWU;;\n\n", ""));
await Kernel.process.spawn(onloadProgram, process, []);