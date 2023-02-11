const ws = Kernel.extensions.get("WindowServer");

ws.createWindow(300, 300, 300, 300, async function main(win) {
  win.innerHTML = `<span>Test</span>`;

  while (true) {
    await new Promise((i) => setTimeout(i, 200));
  }
});