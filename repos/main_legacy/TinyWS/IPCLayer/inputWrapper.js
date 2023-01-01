switch (input.event) {
  case "FetchRequest": {
    if (input.subevent == "genCanvas") return generateCanvas;
  }
  
  case "FetchWindowData": {
    const find = windows.find(i => i.uuid == input.uuid);

    if (!find) {
      return { error: "ENOTFOUND" };
    } else {
      const canvas = find.fetchCanvas();

      return {
        success: true,
        xy: [canvas.style.top, canvas.style.left],
        wh: [canvas.width, canvas.height]
      }
    }
  }

  case "FetchAllWindows": {
    let focused;

    const newWindows = windows.map(function(i) {
      if (i.uuid == focusedUUID) {
        focused = i;
        focused.focused = true;
        return;
      }
      
      return { uuid: i.uuid, focused: false };
    }).filter(function (j) {
      return j != undefined;
    });

    if (focused) newWindows.push(focused);

    return newWindows;
  }

  case "MoveWindow": {
    const find = windows.find(i => i.uuid == input.uuid);

    if (!find) {
      return { error: "ENOTFOUND" };
    } else {
      const canvas = find.fetchCanvas();
      canvas.style.top = input.top;
      canvas.style.left = input.left;
    
      return { success: "NoSkill" };
    }
  }

  case "SetFocusedWindowUUID": {
    if (!input.uuid) return false;

    const window = windows.find(i => i.uuid == input.uuid);
    if (!window) return false;
    
    if (focusedUUID) {
      const oldWindow = windows.find(i => i.uuid == focusedUUID);
      outputDetails("WindowUpdate", oldWindow);
    }

    focusedUUID = input.uuid;

    outputDetails("WindowUpdate", window);

    return true;
  }

  case "FetchFocusedUUID": {
    return focusedUUID;
  }
}