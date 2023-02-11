function inputWrapper(data) {
  if (typeof data != "object") return;
  if (!data.type) return;

  switch (data.type) {
    case "MoveWindow": {
      if (!data.uuid) {
        return {
          type: "failure",
          message: "Missing Window UUID."
        };
      }

      if (!data.top || !data.left) {
        return {
          type: "failure",
          message: "Missing window x or y"
        };
      }

      const window = wsData.getElementsByClassName(data.uuid + "_overlay")[0];
      
      if (!window) return {
        type: "failure",
        message: "Window does not exist!"
      };

      window.style.top = data.top + "px";
      window.style.left = data.left + "px";

      return {
        type: "success"
      }
    }

    default: {
      return {
        type: "failure",
        message: "Unknown data type."
      };
    }
  }
}