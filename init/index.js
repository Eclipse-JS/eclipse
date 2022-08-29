document.title = "EclipseOS";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function execJS(name, path) {
  const data = await fetch(path);
  const dataText = await data.text();

  const processData = Kernel.process.create(dataText);
  Kernel.process.spawn(name, processData); 
}

console.log("Loading VFS Libraries...");

if (localStorage.getItem("preboot_vfs")) {
  const binData = localStorage.getItem("preboot_vfs");

  const process = Kernel.process.create(binData.replaceAll("UWU;;\n\n", ""));
  await Kernel.process.spawn("initvfs", process);
} else {
  await execJS("initvfs", "init/vfs.js");
}

if (VFS.existsSync("/bin/sys", "file")) {
  console.log("Found local copy of Sys");

  const binData = VFS.read("/bin/sys");

  const process = Kernel.process.create(binData.replaceAll("UWU;;\n\n", ""));
  await Kernel.process.spawn("sys", process);
} else {
  console.log("Loading booter...");
  await execJS("booter", "init/sys.js");
}

Sys.drawLogo();
Sys.loadPercent(10);

console.log("Loading binaries...");

if (!VFS.existsSync("/etc/init.d/init.conf", "file")) {
  console.log("No binaries found! Loading liboostrap...");

  await execJS("bootstrap", "init/bootstrap.js");
} else {
  console.log("Loading programs...");
  const initPrgms = VFS.read("/etc/init.d/init.conf").split("\n");

  for (i of initPrgms) {
    try {
      const binData = VFS.read(i);

      const process = Kernel.process.create(binData.replaceAll("UWU;;\n\n", ""));
      await Kernel.process.spawn(i, process);
    } catch (e) {
      console.error("Failed to execute '" + i + "'.");
    }
  }
}

while (true) {
  await sleep(1000);
}