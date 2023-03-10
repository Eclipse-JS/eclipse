function createFakeWin(x, y, width, height) {
  const overlay = document.createElement("div");
    overlay.style.position = "absolute";
    
    overlay.style.top = x + "px";
    overlay.style.left = y + "px";
    overlay.style.width = width + "px";
    overlay.style.height = height + "px";
    overlay.style.overflow = "hidden";

    overlay.style.fontFamily = "system-ui";
    overlay.style.fontSize = "14px";

    overlay.style.zIndex = 12;

  const winTitle = document.createElement("span");
    winTitle.className = "title";
    winTitle.style.display = "hidden";

  const container = document.createElement("div");
    container.className = "container";
    container.style.position = "absolute";
    container.style.top = "0px";

    container.style.width = "100%";
    container.style.height = "100%"; 
  
  overlay.appendChild(winTitle);
  overlay.appendChild(container);

  return overlay;
}