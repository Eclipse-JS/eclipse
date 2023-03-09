const input = Kernel.extensions.get("input");

Kernel.extensions.load("wscompat", {
  createWindow(w, h, func) {
    const ws = Kernel.extensions.get("WindowServer");

    async function dummy(win, add, rm) {
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      win.title = "WSCompat Window";

      win.appendChild(canvas);

      function sync() {
        win.title = canvas.title;
      }

      await func(canvas, sync, add, rm);
    } 
    
    ws.createWindow(300, 300, w, h, dummy);
  } 
})