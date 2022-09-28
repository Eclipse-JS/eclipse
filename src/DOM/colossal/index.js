qb.enableRegularRequire(); /* hee hee hee haw */

const factor = 2; // FIXME: Changing this breaks everything. Oops.

document.title = "ColossalBoot";

require("./libs/displayOpts.js");
require("./libs/uuidv4.js");

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

  const rawUserOptions = localStorage.getItem("os_list") ? localStorage.getItem("os_list") : "[]";
  const userOptions = JSON.parse(rawUserOptions).map(function(i) {
    return { display: localStorage.getItem(i.id + "__bootername"), id: i.id };
  });

  const opt = await displayOpts(ctx, ...userOptions, { display: "Install EclipseOS", id: "os_install" }, { display: "Stress-test kernel and core apps", id: "debug_krnl" });

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, framebuffer.width, framebuffer.height);

  if (opt == "os_install") {
    require("./src/installOS.js");
  } else if (opt == "debug_krnl") {
    require("./src/debug.js");
  } else {
    require("./src/osBooter.js");
  }
});