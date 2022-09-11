Kernel.proxies.addEventListener("mousemove", function(e) {

});

Kernel.proxies.addEventListener("click", function(e) {
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

    const barSize = 27;

    // Checks if the mouse is inside the bar.
    // Causes my head to hurt every time I read this code.

    if (
      (pos[0] >= fixedPos[0] && pos[0] <= fixedPos[0] + resp.wh[0])
      && 
      (pos[1] >= fixedPos[1] - barSize && pos[1] <= fixedPos[1])
    ) {
      console.log("%s: mouse is inside top bar", uuid);
    }
  }
})