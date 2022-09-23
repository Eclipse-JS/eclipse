async function displayOpts(ctx, ...opts) {
  let hasFinishedRunning;

  let selectedElement = opts[0];

  function redraw() {
    ctx.fillStyle = "black";
    ctx.fillRect(12 - factor, 48 + factor, window.innerWidth - (18 + factor), window.innerHeight-(152+factor));

    for (const count in opts) {
      const i = opts[count];
      
      i.id == selectedElement.id ? ctx.fillStyle = "grey" : ctx.fillStyle = "black";
      ctx.fillRect(12 - factor, 48+(24*count) + factor, window.innerWidth - (18 + factor), 20);
  
      ctx.fillStyle = "white";
      ctx.fillText(i.display, 12, 64+(24*count));    
    }
  }

  redraw();

  function eventListener(e) {
    if (e.key == "ArrowUp") {
      const index = opts.indexOf(selectedElement);
      if (index-1 < 0) {
        return;
      }

      selectedElement = opts[index-1];
      return redraw();
    } else if (e.key == "ArrowDown") {
      const index = opts.indexOf(selectedElement);
      if (index+1 > opts.length-1) {
        return;
      }

      selectedElement = opts[index+1];
      return redraw();
    } else if (e.key == "Enter") {
      hasFinishedRunning = true;
    }
  }

  document.addEventListener("keydown", eventListener);

  while (!hasFinishedRunning) {
    await new Promise(r => setTimeout(r, 10));
  }

  document.removeEventListener("keydown", eventListener);

  return selectedElement.id;
}