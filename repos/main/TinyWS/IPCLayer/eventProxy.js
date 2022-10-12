const addedItems = [];
const callbacks = [];

function returnEvt(uuid) {
  return function (name, callback) {
    if (!addedItems.includes(name)) {
      document.addEventListener(name, function(e) {
        const find = callbacks.filter(j => j.event == name);

        for (const j of find) {
          if (j.uuid == focusedUUID) return j.callback(e);
        }
      });

      addedItems.push(name);
    }

    callbacks.push({
      event: name,
      uuid: uuid,
      callback: callback
    });
  };
}