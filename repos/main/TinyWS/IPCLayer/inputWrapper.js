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
}