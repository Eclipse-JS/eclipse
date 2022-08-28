document.title = "EclipseOS";

const ctx = Kernel.display.getFramebuffer();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function loadPercent(percent) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, window.innerHeight-20, window.innerWidth, 20);

  ctx.fillStyle = "grey";
  ctx.fillRect(0, window.innerHeight-20, window.innerWidth*(percent/100), 20);
}

ctx.fillStyle = "white";

function drawLogo() {
  ctx.font = "48px monospace";
  ctx.fillText(
    "EclipseOS™",
    window.innerWidth / 2 - 120,
    window.innerHeight / 2
  );
}

drawLogo();
loadPercent(1);

console.log("Loading VFS Libraries...");

const data = await fetch("init/vfs.js");
const dataText = await data.text();
        
const processData = Kernel.process.create(dataText);
Kernel.process.spawn("vfs", processData);

loadPercent(10);

console.log("Reading /test.txt");
console.log(VFS.existsSync("/bin"));

while (true) {
  await sleep(1000);
}