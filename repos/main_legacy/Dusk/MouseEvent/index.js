let mvUUID = null;
let enableMove = false;

let startPos = [0, 0];

const barSize = 27;

event.addEventListener("mousemove", function(e) {
  if (!enableMove) return;

  wmData.inputWrapper({
    event: "MoveWindow",
    uuid: mvUUID,
    top: e.clientX - startPos[0] < 0 ? 0 : e.clientX - startPos[0],
    left: e.clientY - startPos[1] < barSize ? barSize : e.clientY - startPos[1]
  })
});

event.addEventListener("mousedown", function(e) {
  const pos = [e.clientX, e.clientY];

  for (const i of wmData.inputWrapper({ event: "FetchAllWindows" })) {
    if (!i) continue; // FIXME (TinyWS): Mapped array can sometimes contain undefined contents.

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

      // FIXME (please!): Right now, I'm a lazy bum, and so I don't want to implement more checks to see if you click in the window right now.
      // TLDR: You can only click on the top bar to focus the windows, right now.

      if (!i.focused) wmData.inputWrapper({ event: "SetFocusedWindowUUID", uuid: uuid });

      mvUUID = uuid;
      enableMove = true;
    }
  }
})

event.addEventListener("mouseup", function() {
  enableMove = false;
  
  mvUUID = null;
})