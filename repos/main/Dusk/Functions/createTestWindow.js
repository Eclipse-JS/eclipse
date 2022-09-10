async function createTestWindow() {
  const ws = Kernel.extensions.get("WindowServer");

  ws.createWindow(512, 512, async function(canvasElement) {
    canvasElement.style.top = "300px";
    canvasElement.style.left = "300px";

    canvasElement.title = "Window Test";
    
    const ctx = canvasElement.getContext("2d");

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);

    while (true) {
      await new Promise(r => setTimeout(r, 5000));
    }
  })
}