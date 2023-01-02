function generateUI(x, y, width, height) {
  const overlay = framebuffer.createElement("div");
    overlay.style.position = "absolute";
    
    overlay.style.top = x + "px";
    overlay.style.left = y + "px";
    overlay.style.width = width + "px";
    overlay.style.height = height + "px";
    overlay.style.overflow = "hidden";
    
    overlay.style.backgroundColor = "white";
    overlay.style.color = "black";

    overlay.style.fontFamily = "system-ui";
    overlay.style.fontSize = "14px";
    overlay.style.padding = "3px";

    overlay.style.borderRadius = "8px";

  const titlebar = framebuffer.createElement("div");
    titlebar.style.fontWeight = "600";
    titlebar.style.fontSize = "16px";

    titlebar.style.height = "20px";

    titlebar.style.backgroundColor = "#F4F5FF";
  
    titlebar.style.textAlign = "center";

  const winTitle = framebuffer.createElement("span");
    winTitle.className = "title";
  
  const container = framebuffer.createElement("div");
    container.className = "container";

  titlebar.appendChild(winTitle);
  
  overlay.appendChild(titlebar);
  overlay.appendChild(container);

  return overlay;
}