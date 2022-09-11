async function createTestWindow() {
  const ws = Kernel.extensions.get("WindowServer");

  ws.createWindow(512, 512, async function(canvasElement, update) {
    canvasElement.style.top = "300px";
    canvasElement.style.left = "300px";

    canvasElement.title = "Window Test";
    update();
    
    const ctx = canvasElement.getContext("2d");

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);

    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    
    ctx.fillText("Hello, EclipseOS!", 0, 16);

    while (true) {
      await new Promise(r => setTimeout(r, 5000));
    }
  })
}