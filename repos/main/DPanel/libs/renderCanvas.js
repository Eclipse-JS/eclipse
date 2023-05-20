async function renderCanvas(ws, input) {
  const fb = Kernel.display.getFramebuffer(true);

  // Hacky speedup methods, lol.
  const fbWidth = Kernel.display.size.getWidth()/4;
  const fbHeight = Kernel.display.size.getHeight()/4;

  const canvas = fb.createElement("canvas");
  canvas.width = fbWidth;
  canvas.height = fbHeight;

  canvas.style.position = "absolute";
  canvas.style.width = "100%";
  canvas.style.height = "100%";

  ws.setBackground(canvas);
  
  const ctx = canvas.getContext("2d");
  const imageData = ctx.createImageData(1, 1);
  const image = imageData.data;

  ctx.fillStyle = "#484848";
  ctx.fillRect(0, 0, fbWidth, fbHeight);

  // Code translated from https://seenaburns.com/2018/04/04/writing-to-the-framebuffer/
  input.stdout("Rendering background, get ready for slowness!");

  for (let y = 0; y < fbHeight; y++) {
    for (let x = 0; x < fbWidth; x++) {
      const r = Math.floor(Math.min(x / (fbWidth/256), 255));
      const g = Math.floor(Math.min(y / (fbHeight/256), 255));
      const b = 0;

      image[0] = r;
      image[1] = g;
      image[2] = b;
      image[3] = 255;

      ctx.putImageData(imageData, x, y);
      await new Promise((i) => setTimeout(i, 0.1));
    }
  }

  input.stdout("Done.");
  return canvas;
}