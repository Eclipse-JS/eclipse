function generateUI(x, y, width, height, uuid) {
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

    overlay.style.zIndex = 13;

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

  let mousePressed = false;
  const positionData = [0, 0];

  titlebar.addEventListener("mousedown", function(e) {
    mousePressed = true;

    positionData[0] = e.clientX-parseInt(overlay.style.top.replace("px", ""));
    positionData[1] = e.clientY-parseInt(overlay.style.left.replace("px", ""));
  });

  subscribeMouseUp(function() {
    if (mousePressed) mousePressed = false;

    positionData[0] = 0;
    positionData[1] = 0;
  });

  subscribeMouseMove(function(e) {
    if (!mousePressed) return;
    //console.warn("val ([cx, cy], [posmap]):", [e.clientX, e.clientY], positionData);

    const res = wmData.inputWrapper({
      type: "MoveWindow",
      uuid: uuid,
      top: e.clientY,
      left: e.clientX
    });
  });
  
  overlay.appendChild(titlebar);
  overlay.appendChild(container);

  return overlay;
}