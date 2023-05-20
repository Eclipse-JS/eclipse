const ws = await Kernel.extensions.get("WindowServer");
const input = await Kernel.extensions.get("input");

const fb = Kernel.display.getFramebuffer(true);

const fbWidth = Kernel.display.size.getWidth();
const fbHeight = Kernel.display.size.getHeight();

const animFrameList = [];

qb.require("./libs/3DCube.js");

// Common configuration
const canvas = fb.createElement("canvas");
canvas.width = fbWidth;
canvas.height = fbHeight;

canvas.style.imageRendering = "pixelated";
canvas.style.position = "absolute";
canvas.style.width = "100%";
canvas.style.height = "100%";

const ctx = canvas.getContext("2d");

ws.setBackground(canvas);

ctx.fillStyle = "#484848";
ctx.fillRect(0, 0, fbWidth, fbHeight);
ctx.fillStyle = "#000000";
ctx.font = "16px system-ui";
ctx.fillText("[background rendering, please wait (may experience HEAVY lag spike)...]", 0, 16);

input.stdout("Rendering background...\n");
await new Promise((i) => setTimeout(i, 100));

for (const frame of animFrameList) {
  cancelAnimationFrame(frame);
  animFrameList.splice(animFrameList.indexOf(frame), 1);
}

switch (argv[0]) {
  default: {
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(0, 0, fbWidth, fbHeight);
    
    input.stdout(`No mode specified! (or invalid mode!)
Modes:
  - SimpleRGB
  - 3DCube (soon)\n`);
    break;
  }

  case "SimpleRGB": {
    // Downgrade the quality because F you.
    const fbWidth = Kernel.display.size.getWidth()/4;
    const fbHeight = Kernel.display.size.getHeight()/4;
    canvas.width = fbWidth;
    canvas.height = fbHeight;

    const imageData = ctx.createImageData(1, 1);
    const image = imageData.data;

    for (let y = 0; y < fbHeight; y++) {
      const g = Math.floor(Math.min(y / (fbHeight/256), 255));
      
      for (let x = 0; x < fbWidth; x++) {
        const r = Math.floor(Math.min(x / (fbWidth/256), 255));
        const b = 0;
  
        image[0] = r;
        image[1] = g;
        image[2] = b;
        image[3] = 255;
  
        ctx.putImageData(imageData, x, y);
        //await new Promise((i) => setTimeout(i, 0.1));
      }
    }
  
    input.stdout("Done.\n");
    canvas.style.imageRendering = "auto";
    break;
  }

  case "3DCube": {
    const loopID = render3DCube(ctx, fbWidth, fbHeight);
    animFrameList.push(loopID);

    input.stdout("Started.\n");
  }
}