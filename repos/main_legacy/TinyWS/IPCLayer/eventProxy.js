const addedItems = [];
const callbacks = [];

function returnEvt(uuid) {
  return {
    addEventListener(name, callback) {
      if (!addedItems.includes(name)) {
        document.addEventListener(name, function(e) {
            e.preventDefault();
            
          const find = callbacks.filter(j => j.event == name);
  
          for (const j of find) {
            if (j.uuid == focusedUUID) {
              const win = windows.find(i => i.uuid == focusedUUID);

              if (!win) return;

              if (e instanceof MouseEvent) {
                // KILL YOURSELF

                const canvas = win.fetchCanvas();

                const newE = {};

                const canvasTop = convertCSSStyleToJS(canvas.style.top); // Done this way to not spam JS code to gain some performance back
                const canvasLeft = convertCSSStyleToJS(canvas.style.left);

                newE.clientX = e.clientX - canvasTop;
                newE.clientY = e.clientY - canvasLeft;

                newE.clientX = newE.clientX < 0 ? 0 : newE.clientX;
                newE.clientX = newE.clientX > canvas.width ? canvas.width : newE.clientX;

                newE.clientY = newE.clientY < 0 ? 0 : newE.clientY;
                newE.clientY = newE.clientY > canvas.height ? canvas.height : newE.clientY;

                j.callback(newE);
              } else {
                j.callback(e);
              }
            }
          }
        });
  
        addedItems.push(name);
      }
  
      callbacks.push({
        event: name,
        uuid: uuid,
        callback: callback
      });
    },
    removeEventListener(name, callback) {
      const findCallback = callbacks.find(j => j.uuid == uuid && j.name == name && j.callback == callback);

      if (findCallback) {
        const callbackIndex = callbacks.indexOf(callback);
        callbacks.splice(callbackIndex, 1);
      }
    }
  }
}