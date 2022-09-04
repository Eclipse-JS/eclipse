const ctx = Kernel.display.getFramebuffer();

const Sys = {
  loadPercent: loadPercent,
  drawLogo: drawLogo
}

Kernel.extensions.load("sys", Sys);

function loadPercent(percent) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, window.innerHeight-20, window.innerWidth, 20);

  ctx.fillStyle = "grey";
  ctx.fillRect(0, window.innerHeight-20, window.innerWidth*(percent/100), 20);
}

function drawLogo() {
  ctx.font = "48px monospace";
  ctx.fillText(
    "EclipseOS™",
    window.innerWidth / 2 - 120,
    window.innerHeight / 2
  );
}