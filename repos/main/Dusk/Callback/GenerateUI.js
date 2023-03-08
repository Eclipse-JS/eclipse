function generateUI(x, y, width, height, uuid) {
  const titlebarHeight = 24;

  const canUseNewFeatures = theme.DawnUI.configRevision == "2";

  const overlay = document.createElement("div");
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

    overlay.style.zIndex = 13;
    overlay.style.backgroundColor = theme.styles.general.background["background-color"];
    overlay.style.color = theme.styles.general.accents.white["background-color"];

  const titlebar = document.createElement("div");
    titlebar.style.position = "absolute";
    titlebar.style.left = "0px";
    titlebar.style.top = "0px";
    titlebar.style.width = "100%";

    titlebar.style.fontWeight = "600";
    titlebar.style.fontSize = "16px";

    titlebar.style.height = titlebarHeight + "px";

    titlebar.style.backgroundColor = canUseNewFeatures ? theme.styles["duskplus-config"].titlebar["background-color"] : themes.styles.general.background["background-color"];

    titlebar.style.userSelect = "none";

  const whitespace = document.createElement("span");
    whitespace.innerHTML = "&nbsp;";
  
  titlebar.appendChild(whitespace);

  const winTitle = document.createElement("span");
    winTitle.className = "title";
  
  const container = document.createElement("div");
    container.className = "container";
    container.style.position = "absolute";
    container.style.top = titlebarHeight + "px";

    container.style.width = "100%";
    container.style.height = (height - titlebarHeight) + "px"; 

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