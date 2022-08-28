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

console.log("Loading booter...");
await execJS("booter", "init/sys.js");

Sys.drawLogo();
Sys.loadPercent(5);

console.log("Loading VFS Libraries...");

await execJS("initvfs", "init/vfs.js");
Sys.loadPercent(10);

console.log("Loading binaries...");

if (!VFS.existsSync("/bin")) {
  console.log("No binaries found! Loading liboostrap...");

  await execJS("bootstrap", "init/bootstrap.js");
}

while (true) {
  await sleep(1000);
}