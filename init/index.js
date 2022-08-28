console.log("Loading EclipseOS...");
const framebuffer = Kernel.display.getFramebuffer();

const ctx = framebuffer.getContext("2d");
ctx.fillStyle = "white";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function loadPercent(percent) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, window.innerHeight-20, window.innerWidth, 20);

  ctx.fillStyle = "grey";
  ctx.fillRect(0, window.innerHeight-20, window.innerWidth*(percent/100), 20);
}

function drawLogo() {
  ctx.font = '48px monospace';
  ctx.fillText('EclipseOS™', (window.innerWidth/2)-120, window.innerHeight/2);
}

drawLogo();

for (var i = 0; i <= 100; i++) {
  await sleep(1000);
  loadPercent(i);
}

while (true) {
  await sleep(1000);
}