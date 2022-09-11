let mvUUID = null;
let enableMove = false;

let startPos = [0, 0];

const barSize = 27;

Kernel.proxies.addEventListener("mousemove", function(e) {
  if (!enableMove) return;

  wmData.inputWrapper({
    event: "MoveWindow",
    uuid: mvUUID,
    top: e.clientX - startPos[0] < 0 ? 0 : e.clientX - startPos[0],
    left: e.clientY - startPos[1] < barSize ? barSize : e.clientY - startPos[1]
  })
});

Kernel.proxies.addEventListener("mousedown", function(e) {
  const pos = [e.clientX, e.clientY];

  for (const i of windows) {
    const uuid = i.uuid;

    const resp = wmData.inputWrapper({
      event: "FetchWindowData",
      uuid: uuid
    });

    if (resp.error) {
      console.error("Dusk: Failed to fetch window with UUID: %s, with error: %s.", uuid, resp.error);
      continue;
    }

    const fixedPos = [parseInt(resp.xy[0].replace("px", "")), parseInt(resp.xy[1].replace("px", ""))];

    // Checks if the mouse is inside the bar.
    // Causes my head to hurt every time I read this code.

    if (
      (pos[0] >= fixedPos[0] && pos[0] <= fixedPos[0] + resp.wh[0])
      && 
      (pos[1] >= fixedPos[1] - barSize && pos[1] <= fixedPos[1])
    ) {
      startPos = [pos[0]-fixedPos[0], pos[1]-fixedPos[1]];

      mvUUID = uuid;
      enableMove = true;
    }
  }
})

Kernel.proxies.addEventListener("mouseup", function() {
  enableMove = false;
  mvUUID = null;
})