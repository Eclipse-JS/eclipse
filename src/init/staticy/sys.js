const fb = Kernel.display.getFramebuffer(true);

const fbBoot = fb.createElement("div");
fbBoot.className = "fb_boot_sys";

fb.appendChild(fbBoot);

function loadPercent(percent) {
  const ctx = Kernel.display.getFramebuffer();

  ctx.fillStyle = "black";
  ctx.fillRect(0, window.innerHeight-20, window.innerWidth, 20);

  ctx.fillStyle = "grey";
  ctx.fillRect(0, window.innerHeight-20, window.innerWidth*(percent/100), 20);
}

function drawLogo() {
  const logo = fb.createElement("div");

  logo.style.position = "absolute";
  logo.style.left = window.innerWidth / 2 - 120 + "px";
  logo.style.top = window.innerHeight / 2 - 50  + "px";

  logo.style.fontFamily = "monospace";
  logo.style.fontWeight = "bold";
  logo.style.fontSize = "48px";

  logo.innerText = "EclipseOS™";

  fbBoot.appendChild(logo);
}

const Sys = {
  loadPercent: loadPercent,
  drawLogo: drawLogo
}

Kernel.extensions.load("sys", Sys);