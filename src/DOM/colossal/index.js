qb.enableRegularRequire(); /* hee hee hee haw */

const factor = 2; // FIXME: Changing this breaks everything. Oops.

document.title = "ColossalBoot";

async function displayOpts(ctx, ...opts) {
  ctx.fillStyle = "black";
  ctx.fillRect(12 - factor, 48 + factor, window.innerWidth - (18 + factor), window.innerHeight-(152+factor));

  ctx.fillStyle = "white";

  const selectedElement = opts[0];

  for (const i of opts) {
    ctx.fillStyle = "grey";
    ctx.fillRect(1, 4, 9, 16);

    if (i.id == selectedElement.id) {
      console.log("main element");
    }
  }
}

document.addEventListener("DOMContentLoaded", async function() {
  const framebuffer = document.getElementById("framebuffer");

  framebuffer.width = window.innerWidth;
  framebuffer.height = window.innerHeight;

  const ctx = framebuffer.getContext("2d");

  ctx.fillStyle = "white";
  ctx.font = "16px monospace";

  ctx.fillText(
    "Colossal 0.1.0",
    framebuffer.width / 2 - 120,
    32
  );

  ctx.fillRect(8, 48, framebuffer.width-16, framebuffer.height-150);

  ctx.fillStyle = "black";
  ctx.fillRect(12 - factor, 48 + factor, framebuffer.width - (18 + factor), framebuffer.height-(152+factor));

  ctx.fillStyle = "white";

  ctx.fillText(
    "Use the arrow keys to select an option, and enter to run the option.",
    8,
    framebuffer.height-70
  );

  const opt = await displayOpts(ctx, { display: "Install EclipseOS", id: "new_os" });
});