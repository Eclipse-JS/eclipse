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

              if (e instanceof MouseEvent) {
                // KILL YOURSELF

                const canvas = win.fetchCanvas();

                const newE = {};

                newE.clientX = e.clientX - convertCSSStyleToJS(canvas.style.top);
                newE.clientY = e.clientY - convertCSSStyleToJS(canvas.style.left);

                newE.clientX = newE.clientX < 0 ? 0 : newE.clientX;
                newE.clientX = newE.clientX > convertCSSStyleToJS(canvas.style.top) ? convertCSSStyleToJS(canvas.style.top) : newE.clientX;

                newE.clientY = newE.clientY < 0 ? 0 : newE.clientY;
                newE.clientY = newE.clientY > convertCSSStyleToJS(canvas.style.left) ? convertCSSStyleToJS(canvas.style.left) : newE.clientY;

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